import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits standard for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Derives a 32-byte Buffer key from the environment variable
 */
function getMasterKey() {
  const masterKeyHex =
    process.env.CREDENTIALS_MASTER_KEY ||
    '048aaac599e8efe20cf9ec23daf5275eff664f595a47d4dcc322a1dc112d7145';

  if (!masterKeyHex) {
    throw new Error('CREDENTIALS_MASTER_KEY is not defined in environment variables.');
  }

  // If 64-char hex string, convert from hex; otherwise hash with SHA-256
  if (masterKeyHex.length === 64 && /^[0-9a-fA-F]+$/.test(masterKeyHex)) {
    return Buffer.from(masterKeyHex, 'hex');
  }

  return crypto.createHash('sha256').update(masterKeyHex).digest();
}

/**
 * Encrypts a plaintext secret with AES-256-GCM
 * @param {string} plaintext
 * @returns {{ ciphertext: string, iv: string, authTag: string, algorithm: string }}
 */
export function encryptSecret(plaintext) {
  if (typeof plaintext !== 'string') {
    plaintext = String(plaintext || '');
  }

  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    ciphertext,
    iv: iv.toString('hex'),
    authTag,
    algorithm: ALGORITHM,
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload
 * @param {{ ciphertext: string, iv: string, authTag: string }} encrypted
 * @returns {string} Plaintext secret
 */
export function decryptSecret({ ciphertext, iv, authTag }) {
  if (!ciphertext || !iv || !authTag) {
    throw new Error('Invalid encrypted payload: ciphertext, iv, and authTag are required.');
  }

  const key = getMasterKey();
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, 'hex'),
    { authTagLength: AUTH_TAG_LENGTH }
  );

  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Returns a masked representation of a credential for safe display
 * @param {string} value
 * @returns {string} Masked string (e.g. '••••••••••••••••')
 */
export function maskSecret(value) {
  return '••••••••••••••••';
}
