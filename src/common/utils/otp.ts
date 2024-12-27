import { customAlphabet } from 'nanoid';

export function generateOtp() {
  if (process.env.NODE_ENV !== 'production') return '000000';

  const otpGenerate = customAlphabet('0123456789', 6);
  return otpGenerate();
}
