import { useState, useRef, useEffect } from 'react';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import Avatar from '../components/Avatar';
import CVPreview from '../components/CVPreview';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import logoUrl from '../assets/logomark.svg';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485', ink300: '#9AA3BF',
  blue: '#1448FF', blue50: '#F2F5FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', mist: '#F5F7FB', mist2: '#ECEFF7', hairline: '#E4E8F1',
  success700: '#047857', success100: '#ECFAF3',
  font: 'var(--font-sans)',
};

const buildGreeting = (profile) => {
  if (!profile?.top_profession) return 'Привет! Давай составим твой план развития. С чего начнем?';
  return `Привет! Мы определили, что тебе подходит роль ${profile.top_profession}. Давай составим план подготовки или обсудим гранты?`;
};

function formatMessage(text) {
  if (!text) return '';
  let html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
  return html;
}

function RoadmapTree({ data }) {
  let steps = data;
  if (!steps) return null;
  if (!Array.isArray(steps)) {
    // Handle object with nested steps array
    if (steps.steps && Array.isArray(steps.steps)) steps = steps.steps;
    else if (steps.roadmap && Array.isArray(steps.roadmap)) steps = steps.roadmap;
    else return null;
  }
  if (steps.length === 0) return null;
  return (
    <div style={{ marginTop: 20, padding: 20, background: C.blue50, borderRadius: 16, border: `1px solid ${C.blue100}` }}>
      <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
        Твой план развития
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
              <div style={{ 
                width: 24, height: 24, borderRadius: 12, 
                background: i === 0 ? C.blue : 'white', 
                border: i > 0 ? `2px solid ${C.blue100}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1
              }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: i === 0 ? 'white' : C.blue100 }} />
              </div>
              {i < steps.length - 1 && <div style={{ width: 2, flex: 1, background: C.blue100, margin: '4px 0' }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: 24 }}>
              <div style={{ fontFamily: C.font, fontSize: 14, fontWeight: 700, color: C.ink900 }}>{step.title || step.step || `Шаг ${i + 1}`}</div>
              <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500, marginTop: 2, lineHeight: 1.4 }}>{step.description || step.desc || ''}</div>
              {(step.duration || step.time) && <div style={{ display: 'inline-flex', marginTop: 8, padding: '2px 8px', borderRadius: 4, background: C.paper, border: `1px solid ${C.hairline}`, fontFamily: '"Geist Mono",monospace', fontSize: 11, color: C.blue, fontWeight: 600 }}>
                {step.duration || step.time}
              </div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Chat() {
  const { user, aiProfile } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/api/chats').then(ts => {
      if (ts && ts.length > 0) {
        setThreads(ts.map(t => ({ ...t, messages: [] })));
        const tid = ts[0].id;
        setActiveId(tid);
        loadMessages(tid);
      } else {
        const newId = Date.now();
        setThreads([{ id: newId, title: 'Новый чат', messages: [] }]);
        setActiveId(newId);
      }
    });
  }, []);

  const loadMessages = (tid) => {
    if (!tid || tid > 1000000000) return;
    api.get(`/api/chats/${tid}/messages`).then(ms => {
      setThreads(ts => ts.map(t => t.id === tid ? {
        ...t,
        messages: (ms || []).map(m => ({
          ai: m.role === 'assistant',
          text: m.content,
          roadmap: m.roadmap,
          cv_data: m.cv_data
        }))
      } : t));
    });
  };

  const thread = threads.find(t => t.id === activeId);
  const messages = thread?.messages || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text) => {
    const msg = text || input;
    if (!msg || !msg.trim() || typing) return;
    const userMsg = { ai: false, text: msg };
    setThreads(ts => ts.map(t => t.id === activeId
      ? { ...t, messages: [...t.messages, userMsg], title: t.messages.length === 0 ? msg.slice(0, 32) : t.title }
      : t
    ));
    setInput('');
    setTyping(true);

    try {
      const data = await api.post('/api/ai/chat', { 
        thread_id: typeof activeId === 'number' && activeId < 1000000000 ? activeId : 0,
        message: msg, 
        user_info: {
          name: user?.name,
          grade: user?.grade,
          city: user?.city,
          summary: aiProfile?.summary,
          top_profession: aiProfile?.top_profession
        },
        history: (messages || []).slice(-6).map(m => ({ role: m.ai ? 'assistant' : 'user', content: m.text }))
      });

      setThreads(ts => ts.map(t => t.id === activeId
        ? { 
            ...t, 
            id: data.thread_id,
            messages: [...t.messages, { ai: true, text: data.message, roadmap: data.roadmap, cv_data: data.cv_data }] 
          }
        : t
      ));
      setActiveId(data.thread_id);
    } catch (err) {
      setThreads(ts => ts.map(t => t.id === activeId
        ? { ...t, messages: [...t.messages, { ai: true, text: 'Ошибка: ' + err.message, error: true }] }
        : t
      ));
    } finally {
      setTyping(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.mist }}>
      <TopBar title="AI Консультант" />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 280, borderRight: `1px solid ${C.hairline}`, display: 'flex', flexDirection: 'column', background: C.paper }}>
          <div style={{ padding: 20 }}>
            <Button variant="outline" fullWidth icon="plus" onClick={() => {
              const newId = Date.now();
              setThreads([{ id: newId, title: 'Новый чат', messages: [] }, ...threads]);
              setActiveId(newId);
            }}>Новый чат</Button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '0 12px' }}>
            {threads.map(t => (
              <div 
                key={t.id}
                onClick={() => {
                  setActiveId(t.id);
                  if (t.messages.length === 0) loadMessages(t.id);
                }}
                style={{
                  padding: '12px 16px', borderRadius: 10, cursor: 'pointer', marginBottom: 4,
                  background: activeId === t.id ? C.blue50 : 'transparent',
                  border: `1px solid ${activeId === t.id ? C.blue100 : 'transparent'}`,
                  transition: 'all 200ms'
                }}
              >
                <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: activeId === t.id ? C.blue : C.ink700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.title}
                </div>
                <div style={{ fontFamily: C.font, fontSize: 11, color: C.ink300, marginTop: 2 }}>
                  {t.messages.length} сообщений
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ flex: 1, overflow: 'auto', padding: '40px 0' }}>
            <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: 80 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 32, overflow: 'hidden', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(20,72,255,0.1)' }}>
                    <img src={logoUrl} alt="Talap AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h2 style={{ fontFamily: C.font, fontSize: 24, fontWeight: 800, color: C.ink900, marginBottom: 12 }}>Чем я могу помочь?</h2>
                  <p style={{ fontFamily: C.font, fontSize: 15, color: C.ink500, maxWidth: 400, margin: '0 auto 32px' }}>
                    {buildGreeting(aiProfile)}
                  </p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['Создать резюме', 'Составь план', 'Подбери гранты'].map(c => (
                      <div key={c} onClick={() => send(c)} style={{ padding: '10px 20px', borderRadius: 99, background: 'white', border: `1px solid ${C.hairline}`, color: C.ink700, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 32, flexDirection: m.ai ? 'row' : 'row-reverse' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, overflow: 'hidden', background: m.ai ? 'transparent' : C.mist2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {m.ai ? <img src={logoUrl} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Avatar name={user?.name} size={36} />}
                  </div>
                  <div style={{ flex: 1, maxWidth: '85%' }}>
                    <div style={{ 
                      padding: '16px 20px', borderRadius: 20, 
                      background: m.ai ? 'white' : C.blue, 
                      color: m.ai ? C.ink900 : 'white',
                      boxShadow: m.ai ? '0 4px 12px rgba(10,18,48,0.04)' : 'none',
                      fontFamily: C.font, fontSize: 15, lineHeight: 1.6,
                      border: m.ai ? `1px solid ${C.hairline}` : 'none'
                    }}>
                      <span dangerouslySetInnerHTML={{ __html: formatMessage(m.text) }} />
                      {m.roadmap && <RoadmapTree data={m.roadmap} />}
                      {m.cv_data && m.cv_data.is_ready && <CVPreview data={m.cv_data} />}
                    </div>
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={logoUrl} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '16px 20px', borderRadius: 20, background: 'white', border: `1px solid ${C.hairline}`, display: 'flex', gap: 4 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: C.blue, animation: 'pulse 1s infinite', animationDelay: `${i*0.2}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input Area */}
          <div style={{ padding: '0 24px 32px' }}>
            <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && send()}
                placeholder="Спроси что-нибудь..."
                style={{ 
                  width: '100%', padding: '18px 60px 18px 24px', borderRadius: 20,
                  border: `1px solid ${C.hairline}`, background: 'white',
                  fontFamily: C.font, fontSize: 15, outline: 'none',
                  boxShadow: '0 8px 32px rgba(10,18,48,0.06)',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                onClick={() => send()}
                disabled={!input.trim() || typing}
                style={{ 
                  position: 'absolute', right: 10, top: 10, width: 44, height: 44, borderRadius: 14,
                  background: input.trim() ? C.blue : C.mist, color: 'white', border: 'none',
                  cursor: input.trim() ? 'pointer' : 'default', transition: 'all 200ms',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Icon name="arrowRight" size={20} color={input.trim() ? 'white' : C.ink300} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%% { transform: scale(0.8); opacity: 0.5; }
          50%% { transform: scale(1.2); opacity: 1; }
          100%% { transform: scale(0.8); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
