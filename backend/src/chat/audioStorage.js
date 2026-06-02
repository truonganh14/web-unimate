import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { chatConfig } from './config.js';

export function ensureStorageDirs() {
  fs.mkdirSync(chatConfig.audioStorageDir, { recursive: true });
  fs.mkdirSync(chatConfig.voiceUploadDir, { recursive: true });
}

export function saveReplyAudio(audioBuffer) {
  ensureStorageDirs();
  const filename = `reply_${randomUUID().replaceAll('-', '')}${detectAudioExtension(audioBuffer)}`;
  fs.writeFileSync(path.join(chatConfig.audioStorageDir, filename), audioBuffer);
  return filename;
}

export function resolveAudioPath(filename) {
  const safeName = path.basename(filename);
  const resolved = path.resolve(chatConfig.audioStorageDir, safeName);
  const root = path.resolve(chatConfig.audioStorageDir);

  if (!resolved.startsWith(root) || !fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    return null;
  }

  return resolved;
}

export function publicAudioUrl(filename) {
  return `${chatConfig.publicBaseUrl}/api/v1/audio/${filename}`;
}

export function detectAudioExtension(audioBuffer) {
  if (audioBuffer.subarray(0, 4).toString() === 'RIFF' && audioBuffer.subarray(8, 12).toString() === 'WAVE') {
    return '.wav';
  }
  if (
    audioBuffer.subarray(0, 3).toString() === 'ID3' ||
    [0xff, 0xfb, 0xf3, 0xf2].includes(audioBuffer[0])
  ) {
    return '.mp3';
  }
  return '.bin';
}
