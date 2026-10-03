import { b2StorageService } from '../services/media/b2StorageService.js';
import crypto from 'crypto';

export const mediaController = {
  /**
   * POST /api/media/presign
   * Get pre-signed URL for direct browser upload to Backblaze B2
   */
  getPresignedUrl: async (req, res) => {
    try {
      const { filename, contentType = 'application/octet-stream', folder = 'uploads' } = req.body;

      if (!filename) {
        return res.status(400).json({ success: false, message: 'filename is required.' });
      }

      // Sanitize extension and generate unique key
      const ext = filename.includes('.') ? filename.split('.').pop().toLowerCase() : 'bin';
      const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueId = crypto.randomBytes(6).toString('hex');
      const timestamp = Date.now();
      const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
      const key = `${sanitizedFolder}/${timestamp}-${uniqueId}-${cleanName}`;

      const presigned = await b2StorageService.getPresignedUploadUrl({
        key,
        contentType,
        expiresIn: 900, // 15 mins
      });

      return res.json({
        success: true,
        uploadUrl: presigned.uploadUrl,
        key: presigned.key,
        publicUrl: presigned.publicUrl,
        contentType,
      });
    } catch (err) {
      console.error('[mediaController:getPresignedUrl] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/media/upload-base64
   * Server-side upload for base64 / data-URI images (receipts, avatars, logos)
   */
  uploadBase64: async (req, res) => {
    try {
      const { base64Data, filename = 'upload.png', folder = 'uploads' } = req.body;

      if (!base64Data) {
        return res.status(400).json({ success: false, message: 'base64Data is required.' });
      }

      // Parse data URI if present (data:image/png;base64,....)
      let matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      let contentType = 'application/octet-stream';
      let rawBase64 = base64Data;

      if (matches && matches.length === 3) {
        contentType = matches[1];
        rawBase64 = matches[2];
      }

      const buffer = Buffer.from(rawBase64, 'base64');
      const uniqueId = crypto.randomBytes(6).toString('hex');
      const timestamp = Date.now();
      const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
      const key = `${sanitizedFolder}/${timestamp}-${uniqueId}-${cleanName}`;

      const result = await b2StorageService.uploadBuffer({
        buffer,
        key,
        contentType,
        metadata: {
          uploadedBy: req.user?.email || req.user?.name || 'admin',
        },
      });

      return res.json({
        success: true,
        key: result.key,
        url: result.url,
        size: result.size,
        contentType: result.contentType,
      });
    } catch (err) {
      console.error('[mediaController:uploadBase64] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/media/list
   * List files from Backblaze B2
   */
  listMedia: async (req, res) => {
    try {
      const { prefix = '', maxKeys = 50 } = req.query;
      const result = await b2StorageService.listMedia({
        prefix,
        maxKeys: parseInt(maxKeys, 10) || 50,
      });
      return res.json(result);
    } catch (err) {
      console.error('[mediaController:listMedia] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * DELETE /api/media
   * Delete file from Backblaze B2
   */
  deleteMedia: async (req, res) => {
    try {
      const { key } = req.body;
      if (!key) {
        return res.status(400).json({ success: false, message: 'key is required.' });
      }

      const result = await b2StorageService.deleteFile(key);
      return res.json(result);
    } catch (err) {
      console.error('[mediaController:deleteMedia] Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};

export default mediaController;
