import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Bot,
  ArrowLeft,
  SendHorizontal,
  Volume2,
  VolumeX,
  Trash2,
  Loader2,
} from 'lucide-react';
import { UnimateAvatar } from '../components/UnimateLogo';
import {
  sendChatMessage,
  ChatMessage,
} from '../api/chat';
import { useAuth } from '../context/AuthContext';

function formatTime(isoString: string): string {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoString));
  } catch {
    return '';
  }
}

function generateId(): string {
  return crypto.randomUUID();
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => {
    const stored = sessionStorage.getItem('unimate_session_id');
    if (stored) return stored;
    const id = generateId();
    sessionStorage.setItem('unimate_session_id', id);
    return id;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = useCallback((audioUrl: string) => {
    if (isMuted) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play().catch(() => {});
  }, [isMuted]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const data = await sendChatMessage({ message: text, session_id: sessionId });

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.reply_text,
        audioUrl: data.audio_url ?? undefined,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (data.audio_url && !isMuted) {
        setTimeout(() => playAudio(data.audio_url!), 300);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReplay = (msg: ChatMessage) => {
    if (!msg.audioUrl) return;
    playAudio(msg.audioUrl);
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    sessionStorage.removeItem('unimate_session_id');
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-b border-purple-100 shadow-sm z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl hover:bg-purple-50 transition-colors text-purple-700"
              title="Quay lại trang chủ"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-lg font-bold text-gray-900">Unimate</h1>
              <p className="text-xs text-gray-500">Trợ lý AI FPT University</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <span className="hidden sm:inline text-sm font-medium text-gray-600 mr-2">
                {user.name}
              </span>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 mr-2"
              >
                Đăng nhập
              </Link>
            )}

            <button
              onClick={() => setIsMuted(m => !m)}
              className="p-2 rounded-xl hover:bg-purple-50 transition-colors text-gray-500 hover:text-purple-600"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl hover:bg-purple-50 transition-colors text-gray-500 hover:text-red-500"
              title="Xóa cuộc trò chuyện"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full blur-2xl opacity-20" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-xl">
                  <Bot className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Xin chào! Mình là Unimate
              </h2>
              <p className="text-gray-500 mb-8 max-w-md">
                Trợ lý sinh viên FPT University. Hỏi mình bất cứ điều gì về quy chế, học vụ, lịch thi, học phí nhé!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {[
                  'Cách đăng ký học phần?',
                  'Học phí kỳ này là bao nhiêu?',
                  'Lịch thi cuối kỳ ở đâu xem?',
                  'Làm sao xin giấy chứng nhận SV?',
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="text-left px-4 py-3 bg-white border border-purple-200 rounded-xl text-sm text-gray-700 hover:border-purple-400 hover:bg-purple-50 transition-all shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <span className="font-semibold">Lỗi:</span> {error}
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-9 h-9">
                  <UnimateAvatar />
                </div>
              )}

              <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-tr-md'
                      : 'bg-white border border-purple-100 text-gray-800 rounded-tl-md'
                  }`}
                >
                  {msg.content.split('\n').map((line, i) => {
                    const formatted = line
                      .replace(/\*\*(.+?)\*\*/g, (_, t) => `<strong>${t}</strong>`)
                      .replace(/\*(.+?)\*/g, '<em>$1</em>');

                    const isListItem = /^[📚📝✅🎯⏰💰🔄🎓👋]/.test(line);

                    if (isListItem && line.includes(':')) {
                      const [prefix, ...rest] = line.split(/:(.+)/);
                      return (
                        <p key={i} className="mb-1 last:mb-0">
                          <span dangerouslySetInnerHTML={{ __html: `${prefix}:` }} />
                          {rest.join(':')}
                        </p>
                      );
                    }

                    if (line.startsWith('- ') || line.startsWith('• ')) {
                      return (
                        <p key={i} className="mb-1 last:mb-0 pl-3 border-l-2 border-purple-200">
                          {line.substring(2)}
                        </p>
                      );
                    }

                    if (line === '') {
                      return <br key={i} />;
                    }

                    return (
                      <p key={i} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: formatted }} />
                    );
                  })}
                </div>

                {msg.role === 'assistant' && msg.audioUrl && (
                  <button
                    onClick={() => handleReplay(msg)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Nghe lại
                  </button>
                )}

                <span className="text-xs text-gray-400 px-1">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-9 h-9">
                <UnimateAvatar />
              </div>
              <div className="bg-white border border-purple-100 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Unimate đang suy nghĩ...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-t border-purple-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi Unimate bất cứ điều gì..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-40"
              style={{ minHeight: '24px' }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
              }}
              disabled={isLoading}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 rounded-xl flex items-center justify-center transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <SendHorizontal className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-2">
            Unimate có thể mắc sai sót — kiểm tra thông tin quan trọng với Phòng Dịch vụ Sinh viên.
          </p>
        </div>
      </footer>
    </div>
  );
}
