import { Buffer } from 'buffer';

export function encodeCursor(payload: Record<string, any>): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function decodeCursor(cursor: string): Record<string, any> {
  return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
}
