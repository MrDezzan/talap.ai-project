import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import Search from '../components/Search';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';
import Progress from '../components/Progress';
import Mesh from '../components/Mesh';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485',
  blue: '#1448FF', blue50: '#F2F5FF',
  hairline: '#E4E8F1', mist: '#F5F7FB',
  success700: '#047857', warn700: '#8A5A0E',
  font: 'var(--font-sans)',
};

const CATEGORIES = ['Все', 'IT и данные', 'Дизайн', 'Бизнес', 'Наука', 'Образование', 'Медицина', 'Инженерия'];

function ProfessionModal({ profession, onClose, onAskAI }) {
  if (!profession) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,18,48,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, backdropFilter: 'blur(4px)', padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFFFF', borderRadius: 20, width: '100%', maxWidth: 540,
          maxHeight: '80vh', overflow: 'auto',
          boxShadow: '0 32px 80px rgba(10,18,48,0.2)',
        }}
      >
        <div style={{ padding: '28px 28px 20px', borderBottom: `1px solid ${C.hairline}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {(profession.tags || []).map(t => <Chip key={t}>{t}</Chip>)}
              {profession.hot && <Chip tone="warn" dot>Растёт</Chip>}
            </div>
            <h2 style={{ fontFamily: C.font, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink900, margin: '0 0 4px' }}>
              {profession.name}
            </h2>
            <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500 }}>{profession.category}</div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, background: C.mist, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="plus" size={18} color={C.ink500} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Совпадение', value: `${profession.match_percentage || 0}%` },
              { label: 'Зарплата', value: profession.salary || 'от 300k ₸' },
              { label: 'Спрос', value: profession.growth || '+10%' },
            ].map((s, i) => (
              <div key={i} style={{ background: C.mist, borderRadius: 10, padding: 14 }}>
                <div style={{ fontFamily: C.font, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: C.ink500 }}>{s.label}</div>
                <div style={{ fontFamily: '"Geist Mono",monospace', fontSize: 16, fontWeight: 700, color: C.ink900, marginTop: 4 }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="outline" size="md" style={{ flex: 1 }} icon="sparkles" onClick={onAskAI}>
              Спросить AI
            </Button>
            <Button variant="primary" size="md" style={{ flex: 2 }} icon="arrowRight">
              Построить путь
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const QUIZ = [
  { q: 'Что тебе интереснее всего делать?', opts: ['Создавать программы и сайты', 'Рисовать, проектировать интерфейсы', 'Анализировать данные и находить закономерности', 'Общаться с людьми и управлять командой'] },
  { q: 'Как ты предпочитаешь работать?', opts: ['Один, с кодом и логикой', 'В команде творческих людей', 'Со структурированными данными', 'С людьми, клиентами, коллегами'] },
  { q: 'Какой предмет нравится больше всего?', opts: ['Информатика / Математика', 'Рисование / Технология', 'Физика / Химия', 'История / Обществознание'] },
  { q: 'Как ты принимаешь решения?', opts: ['Анализирую данные и факты', 'Доверяю интуиции и опыту', 'Советуюсь с командой', 'Строю логические модели'] },
  { q: 'Что тебя мотивирует?', opts: ['Создавать продукты, которыми пользуются тысячи', 'Решать сложные инженерные задачи', 'Помогать людям и обществу', 'Зарабатывать и достигать результатов'] },
  { q: 'Какой тип задач тебе ближе?', opts: ['Написать алгоритм или программу', 'Нарисовать макет или прототип', 'Провести исследование и написать отчёт', 'Выступить с презентацией перед аудиторией'] },
  { q: 'Насколько важна тебе творческая свобода?', opts: ['Очень важна — люблю придумывать новое', 'Важна, но нужны чёткие задачи', 'Не важна — ценю стабильность и структуру', 'Важен баланс творчества и порядка'] },
  { q: 'Где хочешь работать через 10 лет?', opts: ['В IT-компании или стартапе', 'В международной организации', 'В своём бизнесе', 'В государственных структурах или науке'] },
];

function QuizModal({ user, analyzeProfile, onClose, onDone }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAnswer = async (opt) => {
    const newAnswers = [...answers, opt];
    setAnswers(newAnswers);
    if (step < QUIZ.length - 1) {
      setStep(s => s + 1);
      return;
    }
    
    // Final step
    setLoading(true);
    try {
      const data = await analyzeProfile({
        name: user?.name || 'Студент',
        grade: user?.grade || '11 класс',
        city: user?.city || 'Казахстан',
        interests: newAnswers, // Send all answers
      });
      
      if (data.error) throw new Error(data.error);
      
      setStep(QUIZ.length); // Show results state
      setTimeout(() => {
        onDone();
      }, 2500);
    } catch (err) {
      console.error(err);
      alert('Ошибка AI-анализа. Попробуй еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.round((step / QUIZ.length) * 100);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,18,48,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(6px)', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#FFFFFF', borderRadius: 24, width: '100%', maxWidth: 560, boxShadow: '0 40px 100px rgba(10,18,48,0.22)' }}>
        <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid #E4E8F1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Chip dot tone="ai">Тест профориентации</Chip>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: '#F5F7FB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plus" size={16} color="#5A6485" style={{ transform: 'rotate(45deg)' }} />
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#5A6485' }}>Вопрос {step + 1} из {QUIZ.length}</span>
            <span style={{ fontFamily: '"Geist Mono",monospace', fontSize: 12, fontWeight: 600, color: '#1448FF' }}>{progress}%</span>
          </div>
          <Progress value={progress} height={4} />
        </div>

        {step >= QUIZ.length ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
             <Mesh intensity={0.5} style={{ borderRadius: 16, padding: 32, background: '#F2F5FF' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1448FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Icon name="check" size={32} color="white" />
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, color: '#0A1230', marginBottom: 8 }}>Анализ завершён!</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: '#5A6485' }}>Мы подобрали идеальный путь для тебя. Переходим к результатам...</div>
            </Mesh>
          </div>
        ) : loading ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <Mesh intensity={0.5} style={{ borderRadius: 16, padding: 32 }}>
              <Icon name="sparkles" size={32} color="#1448FF" />
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: '#0A1230', marginTop: 16, marginBottom: 8 }}>Talap AI анализирует твой профиль...</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#5A6485' }}>Подбираем профессии и гранты под тебя</div>
            </Mesh>
          </div>
        ) : (
          <div style={{ padding: '28px 32px 32px' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: '#0A1230', letterSpacing: '-0.02em', marginBottom: 24, lineHeight: 1.35 }}>
              {QUIZ[step].q}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {QUIZ[step].opts.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    padding: '14px 18px', borderRadius: 10, border: '1.5px solid #E4E8F1',
                    background: '#FFFFFF', fontFamily: 'var(--font-sans)', fontSize: 14,
                    fontWeight: 500, color: '#2A3457', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 150ms', display: 'flex', alignItems: 'center', gap: 12,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1448FF'; e.currentTarget.style.background = '#F2F5FF'; e.currentTarget.style.color = '#1448FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4E8F1'; e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#2A3457'; }}
                >
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: '#F5F7FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Geist Mono",monospace', fontSize: 12, fontWeight: 700, color: '#9AA3BF', flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Catalog() {
  const navigate = useNavigate();
  const { user, analyzeProfile } = useAuth();
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Все');
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    api.get('/api/professions')
      .then(d => { 
        setProfessions(d); 
        setLoading(false); 
      })
      .catch(err => { 
        console.error('Failed to fetch professions:', err);
        setError(err.message);
        setLoading(false); 
      });
  }, []);

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.mist }}>
      <div style={{ textAlign: 'center' }}>
        <Icon name="sparkles" size={40} color={C.blue} style={{ opacity: 0.5 }} />
        <div style={{ marginTop: 16, fontFamily: C.font, color: C.ink500 }}>Загружаем профессии...</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.mist }}>
      <div style={{ textAlign: 'center', maxWidth: 400, padding: 20 }}>
        <Icon name="plus" size={40} color="#FF4D4D" style={{ transform: 'rotate(45deg)' }} />
        <div style={{ marginTop: 16, fontFamily: C.font, fontWeight: 700, fontSize: 18, color: C.ink900 }}>Ошибка загрузки</div>
        <div style={{ marginTop: 8, fontFamily: C.font, color: C.ink500 }}>{error}</div>
        <Button variant="primary" style={{ marginTop: 20 }} onClick={() => window.location.reload()}>Попробовать снова</Button>
      </div>
    </div>
  );

  const filtered = professions.filter(p => activeCategory === 'Все' || p.category === activeCategory);

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.mist, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Каталог профессий"
        actions={
          <>
            <Search placeholder="Найди профессию..." />
            <Button variant="primary" icon="sparkles" size="md" onClick={() => setShowQuiz(true)}>Пройти тест</Button>
          </>
        }
      />

      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {CATEGORIES.map(cat => (
            <Chip
              key={cat}
              selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Chip>
          ))}
          <div style={{ flex: 1 }} />
          <Chip dot tone="ai" onClick={() => navigate('/chat')}>Сортировать AI-подбором</Chip>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filtered.map((p, i) => (
            <Card key={i} onClick={() => setSelectedProfession(p)} style={{ position: 'relative', cursor: 'pointer' }}>
              {p.hot && (
                <div style={{ position: 'absolute', top: 16, right: 16 }}>
                  <Chip tone="warn" dot>Растёт</Chip>
                </div>
              )}
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: C.blue50,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="briefcase" size={22} color={C.blue} strokeWidth={2} />
              </div>
              <div style={{ fontFamily: C.font, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: C.ink900, marginTop: 14 }}>
                {p.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Icon name="sparkles" size={12} color={C.blue} />
                <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 12, fontWeight: 600, color: C.blue }}>
                  {p.match_percentage || 0}% совпадение
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                {(p.tags || []).map(t => <Chip key={t}>{t}</Chip>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.hairline}` }}>
                <div>
                  <div style={{ fontFamily: C.font, fontSize: 11, color: C.ink500 }}>Зарплата</div>
                  <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink900, marginTop: 2 }}>{p.salary || 'от 300k ₸'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: C.font, fontSize: 11, color: C.ink500 }}>Спрос</div>
                  <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.success700, marginTop: 2 }}>{p.growth || '+10%'}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedProfession && (
        <ProfessionModal
          profession={selectedProfession}
          onClose={() => setSelectedProfession(null)}
          onAskAI={() => { setSelectedProfession(null); navigate('/chat'); }}
        />
      )}

      {showQuiz && (
        <QuizModal
          user={user}
          analyzeProfile={analyzeProfile}
          onClose={() => setShowQuiz(false)}
          onDone={() => { setShowQuiz(false); navigate('/dashboard'); }}
        />
      )}
    </div>
  );
}
