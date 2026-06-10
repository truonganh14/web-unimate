import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Bot,
  Sparkles,
  ArrowLeft,
  SendHorizontal,
  Volume2,
  VolumeX,
  Trash2,
  Loader2,
  MessageSquare,
  Plus,
  Clock,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import {
  sendChatMessage,
  getChatSessions,
  getChatHistory,
  ChatMessage,
  ChatSession,
} from '../api/chat';
import { useAuth } from '../context/AuthContext';
import { UnimateAvatar } from '../components/UnimateLogo';

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

function formatDate(isoString: string): string {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(isoString));
  } catch {
    return '';
  }
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

function generateId(): string {
  return crypto.randomUUID();
}

const LOCAL_SESSIONS_KEY = 'unimate_local_sessions';
const LOCAL_HISTORY_PREFIX = 'unimate_history_';

function loadLocalSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalSessions(sessions: ChatSession[]) {
  localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions));
}

function loadLocalHistory(sessionId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(LOCAL_HISTORY_PREFIX + sessionId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalHistory(sessionId: string, messages: ChatMessage[]) {
  localStorage.setItem(LOCAL_HISTORY_PREFIX + sessionId, JSON.stringify(messages));
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  // Load sessions on mount
  useEffect(() => {
    const localSessions = loadLocalSessions();
    setSessions(localSessions);

    getChatSessions(20)
      .then(serverSessions => {
        setSessions(serverSessions);
        saveLocalSessions(serverSessions);
      })
      .catch(() => {
        // fallback to local
      });
  }, []);

  const playAudio = useCallback((audioUrl: string) => {
    if (isMuted) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play().catch(() => {});
  }, [isMuted]);

  const startNewSession = () => {
    const id = generateId();
    const newSession: ChatSession = {
      session_id: id,
      updated_at: new Date().toISOString(),
      last_message: '',
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveLocalSessions(updated);
    setActiveSessionId(id);
    setMessages([]);
  };

  const switchToSession = async (sessionId: string) => {
    if (sessionId === activeSessionId) {
      setSidebarOpen(false);
      return;
    }

    setActiveSessionId(sessionId);
    setLoadingHistory(true);
    setError(null);

    const localMsgs = loadLocalHistory(sessionId);
    if (localMsgs.length > 0) {
      setMessages(localMsgs);
      setLoadingHistory(false);
      return;
    }

    try {
      const history = await getChatHistory(sessionId, 50);
      const mapped: ChatMessage[] = history.map((h, i) => ({
        id: `${sessionId}-${i}`,
        role: h.role as 'user' | 'assistant',
        content: h.content,
        audioUrl: (h as any).audioUrl,
        createdAt: h.createdAt || (h as any).created_at || new Date().toISOString(),
      }));
      setMessages(mapped);
      saveLocalHistory(sessionId, mapped);
    } catch {
      setMessages([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const updateSessionLastMessage = (sessionId: string, text: string) => {
    const updated = sessions.map(s =>
      s.session_id === sessionId
        ? { ...s, last_message: text, updated_at: new Date().toISOString() }
        : s
    );
    setSessions(updated);
    saveLocalSessions(updated);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = generateId();
      const newSession: ChatSession = {
        session_id: sessionId,
        updated_at: new Date().toISOString(),
        last_message: '',
      };
      const updated = [newSession, ...sessions];
      setSessions(updated);
      saveLocalSessions(updated);
    }
    const sid = sessionId;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setActiveSessionId(sid);
    setMessages(prev => {
      const updated = [...prev, userMsg];
      saveLocalHistory(sid, updated);
      return updated;
    });
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const data = await sendChatMessage({ message: text, session_id: sid });

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.reply_text,
        audioUrl: data.audio_url ?? undefined,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => {
        const updated = [...prev, assistantMsg];
        saveLocalHistory(sid, updated);
        return updated;
      });
      updateSessionLastMessage(sid, text);

      if (data.audio_url && !isMuted) {
        setTimeout(() => playAudio(data.audio_url!), 300);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.');
      setMessages(prev => {
        const updated = prev.filter(m => m.id !== userMsg.id);
        saveLocalHistory(sid, updated);
        return updated;
      });
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
    if (!activeSessionId) return;
    setMessages([]);
    localStorage.removeItem(LOCAL_HISTORY_PREFIX + activeSessionId);
    const updated = sessions.map(s =>
      s.session_id === activeSessionId
        ? { ...s, last_message: '', updated_at: new Date().toISOString() }
        : s
    );
    setSessions(updated);
    saveLocalSessions(updated);
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.session_id !== sessionId);
    setSessions(updated);
    saveLocalSessions(updated);
    localStorage.removeItem(LOCAL_HISTORY_PREFIX + sessionId);
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#EEF6FF] via-[#e8f2ff] to-[#f0f6ff] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-72' : 'w-0'
        } overflow-hidden`}
        style={{ backgroundColor: '#1a1a3e' }}
      >
        <div
          className="flex items-center justify-between px-4 h-16 flex-shrink-0 border-b"
          style={{ borderColor: '#2a2a50' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquare className="w-5 h-5 flex-shrink-0" style={{ color: '#00D2FF' }} />
            <span className="font-bold truncate" style={{ color: '#ffffff' }}>Lịch sử</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={startNewSession}
              className="p-2 rounded-xl transition-colors"
              style={{ color: '#00D2FF', backgroundColor: 'transparent' }}
              title="Cuộc trò chuyện mới"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl transition-colors"
              style={{ color: '#7a8ab8' }}
              title="Ẩn thanh bên"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {sessions.length === 0 && (
            <div className="px-4 py-8 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: '#2a2a50' }} />
              <p className="text-sm mb-3" style={{ color: '#7a8ab8' }}>Chưa có cuộc trò chuyện nào</p>
              <button
                onClick={startNewSession}
                className="text-sm font-semibold hover:underline"
                style={{ color: '#00D2FF' }}
              >
                Bắt đầu ngay
              </button>
            </div>
          )}
          {sessions.map(session => (
            <div
              key={session.session_id}
              onClick={() => switchToSession(session.session_id)}
              className="group mx-2 mb-1 px-3 py-3 rounded-xl cursor-pointer transition-all"
              style={{
                backgroundColor: activeSessionId === session.session_id ? '#252560' : 'transparent',
                border: `1px solid ${activeSessionId === session.session_id ? '#2a2a50' : 'transparent'}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" style={{ color: activeSessionId === session.session_id ? '#00D2FF' : '#9aabcd' }}>
                    {session.last_message ? truncate(session.last_message, 40) : 'Cuộc trò chuyện mới'}
                  </p>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#7a8ab8' }}>
                    <Clock className="w-3 h-3" />
                    {formatDate(session.updated_at)}
                  </p>
                </div>
                <button
                  onClick={e => handleDeleteSession(e, session.session_id)}
                  className="p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  style={{ color: '#7a8ab8' }}
                  title="Xóa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header
          className="flex-shrink-0 shadow-sm z-10"
          style={{ backgroundColor: '#1a1a3e', borderBottom: '1px solid #2a2a50' }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-xl transition-colors"
                  style={{ color: '#00D2FF' }}
                  title="Mở lịch sử"
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-xl transition-colors"
                style={{ color: '#00D2FF' }}
                title="Quay lại trang chủ"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <Link to="/" className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 block">
                <UnimateAvatar />
              </Link>

              <div>
                <h1 className="text-lg font-bold" style={{ color: '#ffffff' }}>Unimate</h1>
                <p className="text-xs" style={{ color: '#7a8ab8' }}>Trợ lý AI FPT University</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <span className="hidden sm:inline text-sm font-medium mr-2" style={{ color: '#9aabcd' }}>
                  {user.name}
                </span>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium mr-2"
                  style={{ color: '#00D2FF' }}
                >
                  Đăng nhập
                </Link>
              )}

              <button
                onClick={() => setIsMuted(m => !m)}
                className="p-2 rounded-xl transition-colors"
                style={{ color: '#7a8ab8' }}
                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {activeSessionId && (
                <button
                  onClick={handleClearChat}
                  className="p-2 rounded-xl transition-colors"
                  style={{ color: '#7a8ab8' }}
                  title="Xóa cuộc trò chuyện"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: '#f0f6ff' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            {loadingHistory && (
              <div className="flex items-center justify-center py-12 gap-2" style={{ color: '#7a8ab8' }}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Đang tải lịch sử...</span>
              </div>
            )}

            {!loadingHistory && messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{ backgroundColor: '#00D2FF' }} />
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl overflow-hidden bg-white">
                    <Link to="/"><UnimateAvatar /></Link>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#030536' }}>
                  Xin chào! Mình là Unimate
                </h2>
                <p className="mb-8 max-w-md" style={{ color: '#7a8ab8' }}>
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
                      className="text-left px-4 py-3 rounded-xl text-sm transition-all shadow-sm"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #c5dcff',
                        color: '#2d4a3a',
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }}>
                <span className="font-semibold">Lỗi:</span> {error}
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden bg-white shadow-sm">
                    <UnimateAvatar />
                  </div>
                )}

                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className="px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm"
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #2D8EFF, #00D2FF)', color: '#ffffff' }
                        : { backgroundColor: '#ffffff', border: '1px solid #c5dcff', color: '#2a2a50' }
                    }
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
                          <p key={i} className="mb-1 last:mb-0 pl-3 border-l-2" style={{ borderColor: '#00D2FF' }}>
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
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg transition-colors"
                      style={{ color: '#00D2FF' }}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Nghe lại
                    </button>
                  )}

                  <span className="text-xs px-1" style={{ color: '#9db5a7' }}>
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden bg-white shadow-sm">
                  <UnimateAvatar />
                </div>
                <div className="px-5 py-4 rounded-2xl rounded-tl-md shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #c5dcff' }}>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#7a8ab8' }}>
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
        <footer className="flex-shrink-0 p-4" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2efe5' }}>
          <div className="max-w-3xl mx-auto">
            <div
              className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all"
              style={{ backgroundColor: '#f0f6ff', border: '1px solid #c5dcff' }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi Unimate bất cứ điều gì..."
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none text-sm max-h-40"
                style={{ minHeight: '24px', color: '#1a2e1f' }}
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
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #2D8EFF, #00D2FF)',
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <SendHorizontal className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            <p className="text-center text-xs mt-2" style={{ color: '#9db5a7' }}>
              Unimate có thể mắc sai sót — kiểm tra thông tin quan trọng với Phòng Dịch vụ Sinh viên.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
