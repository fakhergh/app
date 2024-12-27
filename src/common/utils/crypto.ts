import * as crypto from 'crypto';

const algorithm = 'aes256';

export function encrypt(text: string, encryptionKey: string) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return { iv: iv.toString('hex'), encryptedData: encrypted };
}

export function decrypt(encryption: string, encryptionKey: string, iv: string) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryption, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
