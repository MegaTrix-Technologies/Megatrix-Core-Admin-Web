import express from 'express';
import { mediaController } from '../controllers/mediaController.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Apply verifyAdminToken to all media endpoints
router.use(verifyAdminToken);

// Pre-signed URL for direct browser uploads (large files, receipts, documents)
router.post('/presign', mediaController.getPresignedUrl);

// Base64 upload for receipts/avatars/logos
router.post('/upload-base64', mediaController.uploadBase64);

// List bucket assets
router.get('/list', mediaController.listMedia);

// Delete asset
router.delete('/', mediaController.deleteMedia);

export default router;
