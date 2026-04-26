import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Progress from '../components/Progress';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485',
  blue: '#1448FF', blue50: '#F2F5FF',
  hairline: '#E4E8F1', mist: '#F5F7FB',
  font: 'var(--font-sans)',
};

const QUESTIONS = [
  {
    id: 'subject',
    title: 'Какой предмет тебе нравится больше всего?',
    options: [
      { id: 'math', label: 'Математика и логика', icon: 'compass' },
      { id: 'art', label: 'Рисование и дизайн', icon: 'sparkles' },
      { id: 'human', label: 'Общение и люди', icon: 'user' },
      { id: 'science', label: 'Биология и наука', icon: 'target' },
    ]
  },
  {
    id: 'work_type',
    title: 'Как тебе больше нравится работать?',
    options: [
      { id: 'team', label: 'В большой команде', icon: 'users' },
      { id: 'solo', label: 'Самостоятельно', icon: 'user' },
      { id: 'lead', label: 'Руководить процессом', icon: 'award' },
      { id: 'create', label: 'Создавать что-то новое', icon: 'sparkles' },
    ]
  },
  {
    id: 'environment',
    title: 'Твоя идеальная рабочая среда?',
    options: [
      { id: 'office', label: 'Современный офис', icon: 'home' },
      { id: 'remote', label: 'Удаленно из дома', icon: 'globe' },
      { id: 'travel', label: 'Постоянные поездки', icon: 'map' },
      { id: 'lab', label: 'Лаборатория или мастерская', icon: 'target' },
    ]
  },
  {
    id: 'goal',
    title: 'Что для тебя важнее всего в карьере?',
    options: [
      { id: 'money', label: 'Высокий доход', icon: 'award' },
      { id: 'impact', label: 'Польза обществу', icon: 'heart' },
      { id: 'fame', label: 'Признание и слава', icon: 'star' },
      { id: 'growth', label: 'Постоянное обучение', icon: 'book' },
    ]
  }
];

export default function Quiz() {
  const navigate = useNavigate();
  const { analyzeProfile } = useAuth();
  const { t, lang } = useLanguage();
  
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finishing, setFinishing] = useState(false);

  const currentQ = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;

  const select = (optId) => {
    const newAnswers = { ...answers, [currentQ.id]: optId };
    setAnswers(newAnswers);
    
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      finish(newAnswers);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const finish = async (finalAnswers) => {
    setFinishing(true);
    const answersText = QUESTIONS.map(q => `${q.title}: ${q.options.find(o => o.id === finalAnswers[q.id])?.label}`).join('; ');
    try {
      await analyzeProfile({ 
        interests: [answersText], 
        quiz_answers: finalAnswers 
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);
    } catch (err) {
      console.error('Analysis failed:', err);
      navigate('/dashboard');
    }
  };

  if (finishing) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', padding: 24, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 32 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 40, background: C.blue, opacity: 0.1, animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
          <div style={{ position: 'absolute', inset: 10, borderRadius: 32, background: C.blue50, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(20,72,255,0.12)' }}>
            <Icon name="sparkles" size={48} color={C.blue} strokeWidth={2} />
          </div>
        </div>
        <h2 style={{ fontFamily: C.font, fontSize: 28, fontWeight: 800, color: C.ink900, marginBottom: 12, letterSpacing: '-0.02em' }}>Анализируем твой потенциал</h2>
        <p style={{ fontFamily: C.font, fontSize: 16, color: C.ink500, maxWidth: 400, lineHeight: 1.6 }}>Talap AI изучает твои ответы, чтобы подобрать идеальные профессии и гранты именно для тебя...</p>
        <style>{`
          @keyframes ping {
            75%, 100% { transform: scale(1.6); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.mist }}>
      <div style={{ maxWidth: 800, width: '100%', margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button 
              onClick={prevStep}
              disabled={step === 0}
              style={{ 
                width: 36, height: 36, borderRadius: 10, background: 'white', border: `1px solid ${C.hairline}`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: step === 0 ? 'default' : 'pointer',
                opacity: step === 0 ? 0 : 1, transition: 'all 200ms'
              }}
            >
              <Icon name="arrowLeft" size={16} color={C.ink700} />
            </button>
            <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Шаг {step + 1} из {QUESTIONS.length}
            </div>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', color: C.ink500, fontFamily: C.font, fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '8px 12px', borderRadius: 8 }}
          >
            Выйти
          </button>
        </div>
        
        <div style={{ height: 6, width: '100%', background: 'white', borderRadius: 10, overflow: 'hidden', marginBottom: 48, border: `1px solid ${C.hairline}` }}>
          <div style={{ height: '100%', width: `${progress}%`, background: C.blue, transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>

        <div key={step} style={{ animation: 'slideIn 400ms ease-out' }}>
          <h1 style={{ fontFamily: C.font, fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink900, marginBottom: 16, lineHeight: 1.1 }}>
            {currentQ.title}
          </h1>
          <p style={{ fontFamily: C.font, fontSize: 16, color: C.ink500, marginBottom: 40 }}>Выбери один вариант, который лучше всего тебя описывает.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {currentQ.options.map((opt, i) => (
              <button
                key={opt.id}
                onClick={() => select(opt.id)}
                style={{
                  background: '#FFFFFF',
                  border: `2px solid transparent`,
                  borderRadius: 24,
                  padding: '32px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(10,18,48,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  position: 'relative',
                  animation: `fadeIn 400ms ease-out ${i * 50}ms both`
                }}
                onMouseEnter={e => { 
                  e.currentTarget.style.transform = 'translateY(-6px)'; 
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(20,72,255,0.08)';
                  e.currentTarget.style.borderColor = C.blue + '30';
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.transform = 'translateY(0)'; 
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(10,18,48,0.03)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ 
                  width: 56, height: 56, borderRadius: 16, background: C.blue50, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 200ms'
                }}>
                  <Icon name={opt.icon} size={24} color={C.blue} />
                </div>
                <div style={{ fontFamily: C.font, fontSize: 18, fontWeight: 700, color: C.ink900, lineHeight: 1.3 }}>
                  {opt.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
