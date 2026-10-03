import dotenv from 'dotenv';
dotenv.config();

import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';

async function testB2() {
  console.log('Testing Backblaze B2 connection...');
  console.log('Bucket:', process.env.B2_BUCKET_NAME);
  console.log('Endpoint:', process.env.B2_ENDPOINT);
  console.log('Region:', process.env.B2_REGION);
  console.log('Key ID:', process.env.B2_KEY_ID);

  const s3 = new S3Client({
    endpoint: process.env.B2_ENDPOINT,
    region: process.env.B2_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.B2_KEY_ID,
      secretAccessKey: process.env.B2_APPLICATION_KEY,
    },
  });

  console.log('\n--- 1. Testing ListObjectsV2 ---');
  const listCmd = new ListObjectsV2Command({
    Bucket: process.env.B2_BUCKET_NAME,
    MaxKeys: 5,
  });
  const listRes = await s3.send(listCmd);
  console.log('List successful! Objects count:', listRes.KeyCount || 0);

  console.log('\n--- 2. Testing PutObject (health check ping) ---');
  const testKey = `system/healthcheck-${Date.now()}.json`;
  const putCmd = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: testKey,
    Body: JSON.stringify({
      service: 'megatrix-core-admin',
      status: 'active',
      testedAt: new Date().toISOString(),
    }),
    ContentType: 'application/json',
  });
  await s3.send(putCmd);
  console.log('PutObject successful! Uploaded key:', testKey);

  const publicUrl = `${process.env.B2_ENDPOINT}/${process.env.B2_BUCKET_NAME}/${testKey}`;
  console.log('Public URL:', publicUrl);

  console.log('\n=========================================');
  console.log('>>> BACKBLAZE B2 CONNECTED & VERIFIED! <<<');
  console.log('=========================================');
}

testB2().catch(err => {
  console.error('B2 connection error:', err);
  process.exit(1);
});
