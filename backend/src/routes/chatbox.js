import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import { Document } from '../models/Document.js';
import {
  appendMessage,
  getMessages,
  getSessions,
  topQuestions,
  unansweredQuestions,
  usageStats,
} from '../chat/chatStore.js';
import { chatConfig } from '../chat/config.js';
import {
  deleteOpenAiDocument,
  generateReply,
  synthesize,
  synthesizeWithFpt,
  transcribe,
  transcribeRawWithFpt,
  uploadOpenAiDocument,
  extractTranscript,
} from '../chat/providers.js';
import { ensureStorageDirs, publicAudioUrl, resolveAudioPath, saveReplyAudio } from '../chat/audioStorage.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.get('/chat/sessions', async (req, res, next) => {
  try {
    const limit = clampInt(req.query.limit, 50, 1, 500);
    res.json(await getSessions(limit));
  } catch (error) {
    next(error);
  }
});

router.get('/chat/history/:sessionId', async (req, res, next) => {
  try {
    const limit = clampInt(req.query.limit, 50, 1, 500);
    res.json(await getMessages(req.params.sessionId, limit));
  } catch (error) {
    next(error);
  }
});

router.post('/chat/text', async (req, res, next) => {
  try {
    const message = String(req.body?.message || '').trim();
    if (!message) {
      return res.status(400).json({ detail: 'message is required' });
    }

    const sessionId = String(req.body?.session_id || randomUUID());
    const history = await getMessages(sessionId);
    const replyText = await generateReply(message, sessionId, history);
    await appendMessage(sessionId, 'user', message);
    await appendMessage(sessionId, 'assistant', replyText);
    const audioUrl = await synthesizeReply(replyText);

    return res.json({
      session_id: sessionId,
      input_text: message,
      reply_text: replyText,
      audio_url: audioUrl,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/chat/voice', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'file is required' });
    }

    ensureStorageDirs();
    const savedPath = saveVoiceUpload(req.file);
    const sessionId = String(req.body?.session_id || randomUUID());
    const transcript = await transcribe(
      req.file.buffer,
      req.file.originalname || 'recording.wav',
      req.file.mimetype || 'application/octet-stream'
    );
    if (!transcript) {
      return res.status(422).json({
        detail: {
          message: 'FPT ASR response did not include transcript',
          saved_voice_file: savedPath,
          size: req.file.size,
        },
      });
    }

    const history = await getMessages(sessionId);
    const replyText = await generateReply(transcript, sessionId, history);
    await appendMessage(sessionId, 'user', transcript);
    await appendMessage(sessionId, 'assistant', replyText);
    const audioUrl = await synthesizeReply(replyText);

    return res.json({
      session_id: sessionId,
      input_text: transcript,
      transcript,
      reply_text: replyText,
      audio_url: audioUrl,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/audio/:filename', (req, res) => {
  const audioPath = resolveAudioPath(req.params.filename);
  if (!audioPath) {
    return res.status(404).json({ detail: 'Audio file not found' });
  }
  return res.sendFile(audioPath);
});

router.post('/asr/fpt', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'file is required' });
    }
    const raw = await transcribeRaw(req.file);
    return res.json({
      filename: req.file.originalname || 'recording.wav',
      content_type: req.file.mimetype || 'application/octet-stream',
      size: req.file.size,
      transcript: extractTranscript(raw),
      raw,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/tts/fpt', async (req, res, next) => {
  try {
    const text = String(req.body?.text || '').trim();
    if (!text) {
      return res.status(400).json({ detail: 'text is required' });
    }
    const audio = await synthesizeWithFpt(text, {
      voice: req.body?.voice,
      speed: req.body?.speed,
    });
    const filename = saveReplyAudio(audio || Buffer.alloc(0));
    return res.json({
      text,
      voice: req.body?.voice || chatConfig.fptTtsVoice,
      speed: req.body?.speed ?? chatConfig.fptTtsSpeed,
      audio_url: publicAudioUrl(filename),
      size: audio?.length || 0,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/documents/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'file is required' });
    }
    const uploaded = await uploadOpenAiDocument(req.file);
    const document = await Document.create({
      filename: uploaded.filename,
      contentType: uploaded.content_type,
      size: uploaded.size,
      fileId: uploaded.file_id,
      vectorStoreId: uploaded.vector_store_id,
      vectorStoreFileId: uploaded.vector_store_file_id,
      status: uploaded.status,
    });
    return res.json(documentResponse(document));
  } catch (error) {
    next(error);
  }
});

router.get('/documents', async (_req, res, next) => {
  try {
    const documents = await Document.find().sort({ updatedAt: -1, _id: -1 });
    res.json(documents.map(documentResponse));
  } catch (error) {
    next(error);
  }
});

router.put('/documents/:documentId', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'file is required' });
    }
    const existing = await Document.findById(req.params.documentId);
    if (!existing) {
      return res.status(404).json({ detail: 'Document not found' });
    }

    await deleteOpenAiDocument(existing.vectorStoreId, existing.fileId);
    const uploaded = await uploadOpenAiDocument(req.file);
    existing.filename = uploaded.filename;
    existing.contentType = uploaded.content_type;
    existing.size = uploaded.size;
    existing.fileId = uploaded.file_id;
    existing.vectorStoreId = uploaded.vector_store_id;
    existing.vectorStoreFileId = uploaded.vector_store_file_id;
    existing.status = uploaded.status;
    await existing.save();
    return res.json(documentResponse(existing));
  } catch (error) {
    next(error);
  }
});

router.delete('/documents/:documentId', async (req, res, next) => {
  try {
    const existing = await Document.findById(req.params.documentId);
    if (!existing) {
      return res.status(404).json({ detail: 'Document not found' });
    }
    await deleteOpenAiDocument(existing.vectorStoreId, existing.fileId);
    await existing.deleteOne();
    return res.json({ id: req.params.documentId, deleted: true });
  } catch (error) {
    next(error);
  }
});

router.get('/admin/chat/sessions', async (req, res, next) => {
  try {
    res.json(await getSessions(clampInt(req.query.limit, 100, 1, 500)));
  } catch (error) {
    next(error);
  }
});

router.get('/admin/chat/history/:sessionId', async (req, res, next) => {
  try {
    const messages = await getMessages(req.params.sessionId, clampInt(req.query.limit, 100, 1, 500));
    if (messages.length === 0) {
      return res.status(404).json({ detail: 'Chat session not found' });
    }
    return res.json(messages);
  } catch (error) {
    next(error);
  }
});

router.get('/admin/stats/usage', async (req, res, next) => {
  try {
    const period = ['day', 'week', 'month'].includes(req.query.period) ? req.query.period : 'day';
    res.json(await usageStats(period));
  } catch (error) {
    next(error);
  }
});

router.get('/admin/stats/top-questions', async (req, res, next) => {
  try {
    res.json(await topQuestions(clampInt(req.query.limit, 20, 1, 100)));
  } catch (error) {
    next(error);
  }
});

router.get('/admin/stats/unanswered', async (req, res, next) => {
  try {
    res.json(await unansweredQuestions(clampInt(req.query.limit, 50, 1, 200)));
  } catch (error) {
    next(error);
  }
});

async function synthesizeReply(replyText) {
  try {
    const audio = await synthesize(replyText);
    if (!audio) {
      return null;
    }
    return publicAudioUrl(saveReplyAudio(audio));
  } catch (error) {
    console.warn('TTS synthesize failed; returning text only:', error.message);
    return null;
  }
}

async function transcribeRaw(file) {
  return transcribeRawWithFpt(
    file.buffer,
    file.originalname || 'recording.wav',
    file.mimetype || 'application/octet-stream'
  );
}

function saveVoiceUpload(file) {
  const suffix = path.extname(file.originalname || '').toLowerCase() || '.wav';
  const allowedSuffix = ['.wav', '.mp3', '.m4a', '.aac', '.raw', '.pcm'].includes(suffix) ? suffix : '.wav';
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const filename = `voice_${timestamp}_${randomUUID().replaceAll('-', '')}${allowedSuffix}`;
  const savedPath = path.join(chatConfig.voiceUploadDir, filename);
  fs.writeFileSync(savedPath, file.buffer);
  return savedPath;
}

function documentResponse(doc) {
  return {
    id: doc._id.toString(),
    filename: doc.filename,
    content_type: doc.contentType,
    size: Number(doc.size),
    file_id: doc.fileId,
    vector_store_id: doc.vectorStoreId,
    vector_store_file_id: doc.vectorStoreFileId,
    status: doc.status,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
  };
}

function clampInt(value, defaultValue, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) {
    return defaultValue;
  }
  return Math.min(max, Math.max(min, parsed));
}

export default router;
