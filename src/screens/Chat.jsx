import { useRef, useEffect } from 'react';
import Icon from '../components/Icon';
import Chip from '../components/Chip';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485', ink300: '#9AA3BF',
  blue: '#1448FF', blue50: '#F2F5FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', mist: '#F5F7FB', hairline: '#E4E8F1',
  font: 'var(--font-sans)',
};

function RoadmapMessage({ steps }) {
  if (!steps || !steps.length) return null;
  return (
    <div style={{ marginTop: 20, padding: 20, background: C.blue50, borderRadius: 16, border: `1px solid ${C.blue100}` }}>
      <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Твой план развития</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: i === 0 ? C.blue : 'white', border: i > 0 ? `2px solid ${C.blue100}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: i === 0 ? 'white' : C.blue100 }} />
              </div>
              {i < steps.length - 1 && <div style={{ width: 2, flex: 1, background: C.blue100, margin: '4px 0' }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: 24 }}>
              <div style={{ fontFamily: C.font, fontSize: 14, fontWeight: 700, color: C.ink900 }}>{step.title || step.step || `Шаг ${i + 1}`}</div>
              <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500, marginTop: 2, lineHeight: 1.4 }}>{step.description || step.desc || ''}</div>
              {(step.duration || step.time) && <div style={{ display: 'inline-flex', marginTop: 8, padding: '2px 8px', borderRadius: 4, background: C.paper, border: `1px solid ${C.hairline}`, fontFamily: '"Geist Mono",monospace', fontSize: 11, color: C.blue, fontWeight: 600 }}>{step.duration || step.time}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Chat() {
  const { user, aiProfile } = useAuth();
  const { t } = useLanguage();
  const { 
    threads, fetchThreads, activeThreadId, setActiveThreadId, 
    messages: allMessages, addMessage, fetchMessages, setMessages,
    typing, setTyping, inputs, setInputs
  } = useChat();
  
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (threads.length > 0 && !activeThreadId) {
      setActiveThreadId(threads[0].id);
    }
  }, [threads]);

  useEffect(() => {
    if (activeThreadId) {
      fetchMessages(activeThreadId);
    }
  }, [activeThreadId]);

  const messages = activeThreadId ? (allMessages[activeThreadId] || []) : [];
  const currentInput = activeThreadId ? (inputs[activeThreadId] || '') : '';
  const isTyping = activeThreadId ? (typing[activeThreadId] || false) : false;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = async (text) => {
    const msg = text || currentInput;
    if (!msg || !msg.trim() || isTyping) return;
    
    const currentTid = activeThreadId;
    let serverTid = currentTid;
    const isNew = !currentTid || currentTid > 1000000000;
    if (isNew) serverTid = 0;

    addMessage(currentTid, { ai: false, text: msg });
    setInputs(prev => ({ ...prev, [currentTid]: '' }));
    setTyping(prev => ({ ...prev, [currentTid]: true }));

    try {
      const data = await api.post('/api/ai/chat', { 
        thread_id: serverTid, message: msg, 
        user_info: { name: user?.name, grade: user?.grade, city: user?.city, summary: aiProfile?.summary, top_profession: aiProfile?.top_profession },
        history: messages.slice(-6).map(m => ({ role: m.ai ? 'assistant' : 'user', content: m.text }))
      });
      const aiMsg = { ai: true, text: data.message, roadmap: data.roadmap, cv_data: data.cv_data };
      
      if (isNew) {
        setMessages(prev => {
          const next = { ...prev };
          delete next[currentTid];
          next[data.thread_id] = [...(prev[currentTid] || []), aiMsg];
          return next;
        });
        setActiveThreadId(data.thread_id);
        fetchThreads();
      } else {
        addMessage(currentTid, aiMsg);
      }
    } catch (err) {
      addMessage(currentTid, { ai: true, text: 'Ошибка: ' + (err.error || err.message), error: true });
    } finally {
      setTyping(prev => ({ ...prev, [currentTid]: false }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const startNew = () => {
    const tmpId = Date.now();
    setActiveThreadId(tmpId);
    setMessages(prev => ({ ...prev, [tmpId]: [] }));
  };

  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', background: '#FFFFFF' }}>
      <div style={{ borderRight: `1px solid ${C.hairline}`, display: 'flex', flexDirection: 'column', background: C.mist }}>
        <div style={{ padding: 20 }}>
          <Button variant="outline" fullWidth icon="plus" onClick={startNew}>{t('chat_new')}</Button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '0 12px 20px' }}>
          {threads.map(thread => (
            <div
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              style={{
                padding: '12px 16px', borderRadius: 12, cursor: 'pointer', marginBottom: 4,
                background: activeThreadId === thread.id ? '#FFFFFF' : 'transparent',
                boxShadow: activeThreadId === thread.id ? '0 4px 12px rgba(10,18,48,0.05)' : 'none',
                transition: 'all 200ms',
              }}
            >
              <div style={{ fontFamily: C.font, fontSize: 14, fontWeight: activeThreadId === thread.id ? 700 : 500, color: activeThreadId === thread.id ? C.ink900 : C.ink500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {thread.title}
              </div>
              <div style={{ fontFamily: C.font, fontSize: 11, color: C.ink300, marginTop: 4 }}>{new Date(thread.updated_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', height: '100%' }}>
        <div style={{ flex: 1, overflow: 'auto', padding: '40px 0' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', boxShadow: '0 8px 24px rgba(10,18,48,0.06)' }}>
                  <Icon name="sparkles" size={32} color={C.blue} strokeWidth={2} />
                </div>
                <h2 style={{ fontFamily: C.font, fontSize: 24, fontWeight: 800, color: C.ink900, marginBottom: 12 }}>{t('chat_greeting')}</h2>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                  {[t('chat_suggest_cv'), t('chat_suggest_plan'), t('chat_suggest_grants')].map(s => (
                    <Chip key={s} onClick={() => send(s)}>{s}</Chip>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 32, display: 'flex', gap: 20, flexDirection: m.ai ? 'row' : 'row-reverse' }}>
                <div style={{ flexShrink: 0 }}>
                  <Avatar name={m.ai ? 'Talap' : user?.name} size={36} tone={m.ai ? 'ai' : 'default'} />
                </div>
                <div style={{ flex: 1, maxWidth: '85%' }}>
                  <div style={{
                    fontFamily: C.font, fontSize: 15, lineHeight: '1.6', color: m.ai ? C.ink900 : '#FFFFFF',
                    background: m.ai ? 'transparent' : C.blue,
                    padding: m.ai ? '0' : '12px 18px',
                    borderRadius: m.ai ? '0' : '16px 4px 16px 16px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {m.text}
                  </div>
                  {m.roadmap && <RoadmapMessage steps={m.roadmap} />}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
                <Avatar name="Talap" size={36} tone="ai" />
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 36 }}>
                  <div className="dot" style={{ width: 6, height: 6, borderRadius: 3, background: C.ink300, animation: 'pulse 1s infinite' }} />
                  <div className="dot" style={{ width: 6, height: 6, borderRadius: 3, background: C.ink300, animation: 'pulse 1s infinite 0.2s' }} />
                  <div className="dot" style={{ width: 6, height: 6, borderRadius: 3, background: C.ink300, animation: 'pulse 1s infinite 0.4s' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div style={{ padding: '0 24px 32px', maxWidth: 768, width: '100%', margin: '0 auto' }}>
          <div style={{
            background: '#FFFFFF', border: `1px solid ${C.hairline}`, borderRadius: 16, padding: '8px 8px 8px 20px',
            boxShadow: '0 10px 30px rgba(10,18,48,0.08)', display: 'flex', alignItems: 'flex-end', gap: 12
          }}>
            <textarea
              value={currentInput}
              onChange={e => setInputs(prev => ({ ...prev, [activeThreadId]: e.target.value }))}
              onKeyDown={handleKeyDown}
              placeholder={t('chat_placeholder')}
              rows={1}
              style={{
                flex: 1, border: 'none', outline: 'none', fontFamily: C.font, fontSize: 15,
                padding: '10px 0', resize: 'none', maxHeight: 200, background: 'transparent'
              }}
            />
            <button
              onClick={() => send()}
              disabled={!currentInput.trim() || isTyping}
              style={{
                width: 40, height: 40, borderRadius: 10, background: C.blue, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                opacity: currentInput.trim() ? 1 : 0.4, transition: 'all 200ms'
              }}
            >
              <Icon name="arrowRight" size={18} color="#FFFFFF" style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
