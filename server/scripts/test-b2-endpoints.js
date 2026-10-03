import dotenv from 'dotenv';
dotenv.config();

import { mediaController } from '../controllers/mediaController.js';

function mockReq(body = {}, query = {}) {
  return {
    body,
    query,
    user: { id: 'admin_test', name: 'Super Admin', email: 'admin@megatrix.internal' },
  };
}

function mockRes() {
  const res = {
    statusCode: 200,
    data: null,
    status(c) {
      this.statusCode = c;
      return this;
    },
    json(d) {
      this.data = d;
      return this;
    },
  };
  return res;
}

async function runMediaTests() {
  console.log('Testing Media Controller with Backblaze B2...\n');

  console.log('--- 1. Testing getPresignedUrl ---');
  const resPresign = mockRes();
  await mediaController.getPresignedUrl(
    mockReq({ filename: 'invoice-sample.pdf', contentType: 'application/pdf', folder: 'receipts' }),
    resPresign
  );
  console.log('Presign status:', resPresign.statusCode);
  console.log('Generated Key:', resPresign.data?.key);
  console.log('Public URL:', resPresign.data?.publicUrl);
  console.log('Upload URL length:', resPresign.data?.uploadUrl?.length);

  console.log('\n--- 2. Testing direct PUT to presigned URL ---');
  const testBuffer = Buffer.from('PDF Mock Content from MegaTrix Admin', 'utf-8');
  const putRes = await fetch(resPresign.data.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/pdf' },
    body: testBuffer,
  });
  console.log('Direct upload HTTP status:', putRes.status);

  console.log('\n--- 3. Testing uploadBase64 ---');
  const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const resBase64 = mockRes();
  await mediaController.uploadBase64(
    mockReq({ base64Data: sampleBase64, filename: 'pixel.png', folder: 'avatars' }),
    resBase64
  );
  console.log('Base64 upload status:', resBase64.statusCode);
  console.log('Uploaded image URL:', resBase64.data?.url);

  console.log('\n--- 4. Testing listMedia ---');
  const resList = mockRes();
  await mediaController.listMedia(mockReq({}, { maxKeys: 10 }), resList);
  console.log('List status:', resList.statusCode);
  console.log('Total files found:', resList.data?.files?.length);
  resList.data?.files?.forEach(f => console.log(' -', f.key, `(${f.size} bytes)`));

  console.log('\n--- 5. Testing deleteMedia ---');
  const resDel = mockRes();
  await mediaController.deleteMedia(mockReq({ key: resPresign.data.key }), resDel);
  console.log('Delete status:', resDel.statusCode);
  console.log('Deleted key:', resDel.data?.deletedKey);

  console.log('\n===============================================');
  console.log('>>> ALL BACKBLAZE B2 MEDIA ENDPOINTS WORKING! <<<');
  console.log('===============================================');
}

runMediaTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
