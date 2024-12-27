import { authenticator } from 'otplib';

export function generate2faSecretQrCodeUrl(secret: string, label: string, user: string) {
  const encodedLabel = encodeURIComponent(label);
  const encodedUser = encodeURIComponent(user);
  return `otpauth://totp/${encodedLabel}:${encodedUser}?secret=${secret}&issuer=${encodedLabel}`;
}

export function verifyTwoFactorOtp(otp: string, secret: string) {
  return authenticator.check(otp, secret);
}
