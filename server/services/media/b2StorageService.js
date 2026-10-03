import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class B2StorageService {
  constructor() {
    this.client = null;
  }

  getClient() {
    if (!this.client) {
      this.bucketName = process.env.B2_BUCKET_NAME || 'megatrix-core-admin';
      this.endpoint = process.env.B2_ENDPOINT || 'https://s3.eu-central-003.backblazeb2.com';
      this.region = process.env.B2_REGION || 'eu-central-003';
      this.keyId = process.env.B2_KEY_ID;
      this.applicationKey = process.env.B2_APPLICATION_KEY;

      if (!this.keyId || !this.applicationKey) {
        console.warn('[B2StorageService] Warning: B2_KEY_ID or B2_APPLICATION_KEY is not set in environment.');
      }

      this.client = new S3Client({
        endpoint: this.endpoint,
        region: this.region,
        forcePathStyle: true,
        credentials: {
          accessKeyId: this.keyId,
          secretAccessKey: this.applicationKey,
        },
      });
    }
    return this.client;
  }

  getBucketName() {
    return process.env.B2_BUCKET_NAME || 'megatrix-core-admin';
  }

  getEndpoint() {
    return process.env.B2_ENDPOINT || 'https://s3.eu-central-003.backblazeb2.com';
  }

  /**
   * Constructs the canonical public access URL for an uploaded file
   */
  getPublicUrl(key) {
    const cleanKey = key.startsWith('/') ? key.slice(1) : key;
    return `${this.getEndpoint()}/${this.getBucketName()}/${cleanKey}`;
  }

  /**
   * Upload binary buffer directly from backend to Backblaze B2
   */
  async uploadBuffer({ buffer, key, contentType = 'application/octet-stream', metadata = {} }) {
    const cleanKey = key.startsWith('/') ? key.slice(1) : key;
    const client = this.getClient();
    const bucket = this.getBucketName();

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    });

    await client.send(command);

    return {
      success: true,
      key: cleanKey,
      url: this.getPublicUrl(cleanKey),
      bucket,
      size: buffer.length,
      contentType,
    };
  }

  /**
   * Generates a secure pre-signed PUT URL allowing direct browser-to-B2 uploads.
   * This bypasses Vercel/serverless request payload limits (4.5 MB).
   */
  async getPresignedUploadUrl({ key, contentType = 'application/octet-stream', expiresIn = 600 }) {
    const cleanKey = key.startsWith('/') ? key.slice(1) : key;
    const client = this.getClient();
    const bucket = this.getBucketName();

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: cleanKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn });

    return {
      uploadUrl,
      key: cleanKey,
      publicUrl: this.getPublicUrl(cleanKey),
      expiresIn,
    };
  }

  /**
   * Delete an object from the bucket
   */
  async deleteFile(key) {
    const cleanKey = key.startsWith('/') ? key.slice(1) : key;
    const client = this.getClient();
    const bucket = this.getBucketName();

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: cleanKey,
    });

    await client.send(command);

    return {
      success: true,
      deletedKey: cleanKey,
    };
  }

  /**
   * List files in the bucket with optional folder prefix
   */
  async listMedia({ prefix = '', maxKeys = 100 } = {}) {
    const client = this.getClient();
    const bucket = this.getBucketName();

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
    });

    const response = await client.send(command);

    const files = (response.Contents || []).map((item) => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      etag: item.ETag,
      url: this.getPublicUrl(item.Key),
    }));

    return {
      success: true,
      files,
      keyCount: response.KeyCount || files.length,
      isTruncated: response.IsTruncated || false,
      nextContinuationToken: response.NextContinuationToken || null,
    };
  }
}

export const b2StorageService = new B2StorageService();
export default b2StorageService;
