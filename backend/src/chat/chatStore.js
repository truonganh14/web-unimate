import { ChatMessage } from '../models/ChatMessage.js';

const UNANSWERED_MARKERS = [
  'minh chua co thong tin',
  'mình chưa có thông tin',
  'chua co thong tin',
  'chưa có thông tin',
  'khong tim thay',
  'không tìm thấy',
];

function bucketFormat(period) {
  if (period === 'week') {
    return '%Y-W%V';
  }
  if (period === 'month') {
    return '%Y-%m';
  }
  return '%Y-%m-%d';
}

export async function appendMessage(sessionId, role, content) {
  await ChatMessage.create({ sessionId, role, content });
}

export async function getMessages(sessionId, limit = 20) {
  const rows = await ChatMessage.find({ sessionId })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .lean();

  return rows.reverse().map((row) => ({
    role: row.role,
    content: row.content,
    created_at: row.createdAt,
  }));
}

export async function getSessions(limit = 50) {
  const rows = await ChatMessage.aggregate([
    { $sort: { createdAt: -1, _id: -1 } },
    {
      $group: {
        _id: '$sessionId',
        updated_at: { $first: '$createdAt' },
        last_message: { $first: '$content' },
      },
    },
    { $sort: { updated_at: -1 } },
    { $limit: limit },
  ]);

  return rows.map((row) => ({
    session_id: row._id,
    updated_at: row.updated_at,
    last_message: row.last_message,
  }));
}

export async function usageStats(period) {
  const unit = ['day', 'week', 'month'].includes(period) ? period : 'day';
  const format = bucketFormat(unit);

  const [totals, buckets] = await Promise.all([
    ChatMessage.aggregate([
      {
        $group: {
          _id: null,
          total_messages: { $sum: 1 },
          user_messages: {
            $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] },
          },
          assistant_messages: {
            $sum: { $cond: [{ $eq: ['$role', 'assistant'] }, 1, 0] },
          },
          sessions: { $addToSet: '$sessionId' },
        },
      },
      {
        $project: {
          total_messages: 1,
          user_messages: 1,
          assistant_messages: 1,
          sessions: { $size: '$sessions' },
        },
      },
    ]),
    ChatMessage.aggregate([
      {
        $group: {
          _id: { $dateToString: { format, date: '$createdAt' } },
          total_messages: { $sum: 1 },
          user_messages: {
            $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] },
          },
          assistant_messages: {
            $sum: { $cond: [{ $eq: ['$role', 'assistant'] }, 1, 0] },
          },
          sessions: { $addToSet: '$sessionId' },
        },
      },
      {
        $project: {
          bucket: '$_id',
          total_messages: 1,
          user_messages: 1,
          assistant_messages: 1,
          sessions: { $size: '$sessions' },
        },
      },
      { $sort: { bucket: -1 } },
      { $limit: 30 },
    ]),
  ]);

  return {
    period: unit,
    total_messages: totals[0]?.total_messages ?? 0,
    user_messages: totals[0]?.user_messages ?? 0,
    assistant_messages: totals[0]?.assistant_messages ?? 0,
    sessions: totals[0]?.sessions ?? 0,
    buckets: buckets.map((row) => ({
      bucket: row.bucket,
      total_messages: row.total_messages,
      user_messages: row.user_messages,
      assistant_messages: row.assistant_messages,
      sessions: row.sessions,
    })),
  };
}

export async function topQuestions(limit = 20) {
  const rows = await ChatMessage.aggregate([
    { $match: { role: 'user', content: { $regex: /\S/ } } },
    {
      $group: {
        _id: { $toLower: { $trim: { input: '$content' } } },
        question: { $first: { $trim: { input: '$content' } } },
        count: { $sum: 1 },
        last_asked_at: { $max: '$createdAt' },
      },
    },
    { $sort: { count: -1, last_asked_at: -1 } },
    { $limit: limit },
  ]);

  return rows.map((row) => ({
    question: row.question,
    count: row.count,
    last_asked_at: row.last_asked_at,
  }));
}

export async function unansweredQuestions(limit = 50) {
  const sessions = await ChatMessage.aggregate([
    { $match: { role: { $in: ['user', 'assistant'] } } },
    { $sort: { sessionId: 1, createdAt: 1, _id: 1 } },
    {
      $group: {
        _id: '$sessionId',
        messages: {
          $push: {
            role: '$role',
            content: '$content',
            createdAt: '$createdAt',
          },
        },
      },
    },
  ]);

  const results = [];

  for (const session of sessions) {
    const messages = session.messages;
    for (let index = 0; index < messages.length - 1; index += 1) {
      const current = messages[index];
      const next = messages[index + 1];
      if (current.role !== 'user' || next.role !== 'assistant') {
        continue;
      }

      const answer = next.content.toLowerCase();
      const isUnanswered = UNANSWERED_MARKERS.some((marker) => answer.includes(marker));
      if (!isUnanswered) {
        continue;
      }

      results.push({
        session_id: session._id,
        question: current.content,
        answer: next.content,
        asked_at: current.createdAt,
      });
    }
  }

  return results
    .sort((left, right) => new Date(right.asked_at) - new Date(left.asked_at))
    .slice(0, limit);
}
