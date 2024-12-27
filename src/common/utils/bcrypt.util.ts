import * as bcryptjs from 'bcryptjs';

export async function hash(text: string): Promise<string> {
  const salt = await bcryptjs.genSalt(parseInt(process.env.PASSWORD_HASH_SALT) || 10);
  return bcryptjs.hash(text, salt);
}

export async function compareHash(text: string, hashedText: string): Promise<boolean> {
  return bcryptjs.compare(text, hashedText);
}
