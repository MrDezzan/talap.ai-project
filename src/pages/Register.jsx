import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Progress from '../components/Progress';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485', ink300: '#9AA3BF',
  blue: '#1448FF', blue50: '#F2F5FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', mist: '#F5F7FB', hairline: '#E4E8F1',
  error700: '#B42318',
  success700: '#047857', success100: '#ECFAF3',
  font: 'var(--font-sans)',
};

function Field({ label, type = 'text', value, onChange, placeholder, error, hint, autoFocus }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 8,
          border: `1px solid ${error ? C.error700 : focused ? C.blue : C.hairline}`,
          fontFamily: C.font, fontSize: 15, color: C.ink900, background: C.paper,
          outline: 'none', transition: 'border-color 150ms',
          boxShadow: focused ? `0 0 0 3px rgba(20,72,255,0.08)` : 'none',
          boxSizing: 'border-box',
        }}
      />
      {error && <div style={{ fontFamily: C.font, fontSize: 12, color: C.error700, marginTop: 4 }}>{error}</div>}
      {hint && !error && <div style={{ fontFamily: C.font, fontSize: 12, color: C.ink500, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, error, t }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 8,
          border: `1px solid ${error ? C.error700 : focused ? C.blue : C.hairline}`,
          fontFamily: C.font, fontSize: 15, color: value ? C.ink900 : C.ink300,
          background: C.paper, outline: 'none', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239AA3BF' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
          cursor: 'pointer', boxSizing: 'border-box',
        }}
      >
        <option value="">{t('auth_select') || 'Выбери...'}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <div style={{ fontFamily: C.font, fontSize: 12, color: C.error700, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function AnalyzingScreen({ name, t, lang }) {
  const STAGES = [
    { icon: 'user',      text: lang === 'en' ? 'Studying your profile...' : lang === 'kz' ? 'Профильіңізді зерттеу...' : 'Изучаю твой профиль...',        sub: lang === 'en' ? 'Analyzing interests and goals' : lang === 'kz' ? 'Қызығушылықтар мен мақсаттарды талдау' : 'Анализирую интересы и цели' },
    { icon: 'compass',   text: lang === 'en' ? 'Picking professions...' : lang === 'kz' ? 'Мамандықтар таңдау...' : 'Подбираю профессии...',          sub: lang === 'en' ? 'Calculating matches' : lang === 'kz' ? 'Сәйкестікті есептеу' : 'Считаю совпадение с твоими данными' },
    { icon: 'award',     text: lang === 'en' ? 'Analyzing grants...' : lang === 'kz' ? 'Гранттарды талдау...' : 'Анализирую гранты...',           sub: lang === 'en' ? 'Searching for programs' : lang === 'kz' ? 'Бағдарламаларды іздеу' : 'Ищу подходящие программы в Казахстане' },
    { icon: 'target',    text: lang === 'en' ? 'Building roadmap...' : lang === 'kz' ? 'Жол картасын құру...' : 'Строю карьерный маршрут...',     sub: lang === 'en' ? 'Generating step-by-step plan' : lang === 'kz' ? 'Қадамдық жоспар құру' : 'Формирую пошаговый план для тебя' },
  ];

  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const totalDuration = 7000;
    const stageCount = STAGES.length;
    const stageInterval = totalDuration / stageCount;

    const stageTimer = setInterval(() => {
      setStage(s => {
        const next = s + 1;
        if (next >= stageCount) {
          clearInterval(stageTimer);
          setDone(true);
          return s;
        }
        return next;
      });
    }, stageInterval);

    const progressTimer = setInterval(() => {
      setProgress(p => Math.min(p + 1, 95));
    }, totalDuration / 95);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.2; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ background: C.paper, borderRadius: 20, padding: 40, border: `1px solid ${C.hairline}`, boxShadow: '0 8px 32px rgba(10,18,48,0.06)', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 28px' }}>
          <div style={{
            position: 'absolute', inset: -8, borderRadius: 9999,
            background: 'rgba(20,72,255,0.1)',
            animation: 'pulse-ring 2s ease-in-out infinite',
          }} />
          <div style={{
            width: 80, height: 80, borderRadius: 9999,
            background: `conic-gradient(${C.blue} ${progress * 3.6}deg, ${C.blue50} 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 9999,
              background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={done ? 'check' : STAGES[stage].icon} size={28} color={C.blue} strokeWidth={1.75} />
            </div>
          </div>
        </div>

        <div style={{ fontFamily: C.font, fontSize: 22, fontWeight: 700, color: C.ink900, marginBottom: 6 }}>
          {done ? (lang === 'en' ? `Ready, ${name}!` : lang === 'kz' ? `Дайын, ${name}!` : `Готово, ${name}!`) : STAGES[stage].text}
        </div>
        <div style={{ fontFamily: C.font, fontSize: 14, color: C.ink500, marginBottom: 32, minHeight: 20 }}>
          {done ? (lang === 'en' ? 'Opening your personal dashboard...' : lang === 'kz' ? 'Жеке тақтаны ашуда...' : 'Открываю твой персональный дашборд...') : STAGES[stage].sub}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: C.font, fontSize: 12, color: C.ink500 }}>{lang === 'en' ? 'Profile analysis' : lang === 'kz' ? 'Профиль талдау' : 'Анализ профиля'}</span>
            <span style={{ fontFamily: '"Geist Mono",monospace', fontSize: 12, fontWeight: 600, color: C.blue }}>{done ? 100 : progress}%</span>
          </div>
          <Progress value={done ? 100 : progress} height={6} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {STAGES.map((s, i) => {
            const isActive = i === stage && !done;
            const isDone = i < stage || done;
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8,
                  background: isActive ? C.blue50 : 'transparent',
                  transition: 'background 300ms',
                  animation: isActive ? 'fade-in-up 0.3s ease' : 'none',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 9999, flexShrink: 0,
                  background: isDone ? C.blue : isActive ? C.blue100 : C.mist,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isDone
                    ? <Icon name="check" size={10} color="white" strokeWidth={2.5} />
                    : <div style={{ width: 6, height: 6, borderRadius: 9999, background: isActive ? C.blue : C.ink300 }} />
                  }
                </div>
                <span style={{
                  fontFamily: C.font, fontSize: 13,
                  color: isDone ? C.ink900 : isActive ? C.blue : C.ink300,
                  fontWeight: isDone || isActive ? 600 : 400,
                }}>
                  {s.text.replace('...', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  const { login, register, analyzeProfile } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analyzingName, setAnalyzingName] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    grade: '', city: '', interests: [],
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const toggleInterest = (i) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i],
    }));
  };

  const validateStep0 = () => {
    const e = {};
    if (!form.name.trim()) e.name = t('auth_error_name') || 'Введи имя';
    if (!form.email) e.email = t('auth_error_email') || 'Введи email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t('auth_error_email_invalid') || 'Некорректный email';
    if (!form.password) e.password = t('auth_error_pass') || 'Придумай пароль';
    else if (form.password.length < 6) e.password = t('auth_error_pass_short') || 'Минимум 6 символов';
    return e;
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.grade) e.grade = t('auth_error_grade') || 'Выбери класс или курс';
    if (!form.city) e.city = t('auth_error_city') || 'Выбери город';
    return e;
  };

  const GRADES = lang === 'en' ? ['9th Grade', '10th Grade', '11th Grade', '1st Year', '2nd Year', '3rd Year', '4th Year'] :
                 lang === 'kz' ? ['9 сынып', '10 сынып', '11 сынып', '1 курс', '2 курс', '3 курс', '4 курс'] :
                 ['9 класс', '10 класс', '11 класс', '1 курс', '2 курс', '3 курс', '4 курс'];
                 
  const CITIES = lang === 'en' ? ['Almaty', 'Astana', 'Shymkent', 'Atyrau', 'Aktobe', 'Pavlodar', 'Other'] :
                 lang === 'kz' ? ['Алматы', 'Астана', 'Шымкент', 'Атырау', 'Ақтөбе', 'Павлодар', 'Басқа қала'] :
                 ['Алматы', 'Астана', 'Шымкент', 'Атырау', 'Актобе', 'Павлодар', 'Другой город'];

  const INTERESTS = lang === 'en' ? ['Math', 'CS', 'Biology', 'Physics', 'Chemistry', 'History', 'Languages', 'Economy', 'Design', 'Sport'] :
                    lang === 'kz' ? ['Математика', 'Информатика', 'Биология', 'Физика', 'Химия', 'Тарих', 'Тілдер', 'Экономика', 'Дизайн', 'Спорт'] :
                    ['Математика', 'Информатика', 'Биология', 'Физика', 'Химия', 'История', 'Языки', 'Экономика', 'Дизайн', 'Спорт'];


  const nextStep = async () => {
    if (step === 0) {
      const errs = validateStep0();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setStep(1);
      return;
    }

    if (step === 1) {
      const errs = validateStep1();
      if (Object.keys(errs).length) { setErrors(errs); return; }

      setLoading(true);
      try {
        const regRes = await register(form.name, form.email, form.password);
        if (regRes.error) throw new Error(regRes.error);

        const loginRes = await login(form.email, form.password);
        if (loginRes.error) throw new Error(loginRes.error);

        setAnalyzingName(form.name.split(' ')[0]);
        setStep(2);

        const [analysisResult] = await Promise.all([
          analyzeProfile({
            name: form.name,
            grade: form.grade,
            city: form.city,
            interests: form.interests,
          }),
          new Promise(r => setTimeout(r, 7500)),
        ]);

        if (analysisResult?.error) {
          console.warn('AI analysis failed:', analysisResult.error);
        }

        navigate('/dashboard');
      } catch (err) {
        setErrors({ grade: err.message || 'Ошибка регистрации. Попробуй снова.' });
        setLoading(false);
      }
    }
  };

  if (step === 2) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: C.mist, padding: 24,
      }}>
        <AnalyzingScreen name={analyzingName} t={t} lang={lang} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: C.font, fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', color: C.ink900, margin: '0 0 8px' }}>
          {t('auth_register_title')}
        </h1>
        <p style={{ fontFamily: C.font, fontSize: 15, color: C.ink500, margin: 0 }}>
          {lang === 'en' ? `Step ${step + 1} of 2 — takes 2 mins` : lang === 'kz' ? `${step + 1}-ші қадам — 2 минут алады` : `Шаг ${step + 1} из 2 — займёт 2 минуты`}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 9999,
            background: i <= step ? C.blue : C.hairline,
            transition: 'background 300ms',
          }} />
        ))}
      </div>

      <div style={{ background: C.paper, borderRadius: 16, padding: 32, border: `1px solid ${C.hairline}`, boxShadow: '0 8px 32px rgba(10,18,48,0.06)' }}>
        {step === 0 && (
          <>
            <Field label={t('auth_name_label')} value={form.name} onChange={set('name')} placeholder="Айдана Серикова" error={errors.name} autoFocus />
            <Field label={t('auth_email_label')} type="email" value={form.email} onChange={set('email')} placeholder="твой@email.kz" error={errors.email} />
            <Field label={t('auth_pass_label')} type="password" value={form.password} onChange={set('password')} placeholder="••••••••" error={errors.password} hint={lang === 'en' ? 'Use letters and digits' : lang === 'kz' ? 'Әріптер мен сандарды қолданыңыз' : 'Используй буквы и цифры'} />
          </>
        )}

        {step === 1 && (
          <>
            <SelectField label={t('settings_grade')} value={form.grade} onChange={set('grade')} options={GRADES} error={errors.grade} t={t} />
            <SelectField label={t('settings_city')} value={form.city} onChange={set('city')} options={CITIES} error={errors.city} t={t} />
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, marginBottom: 10 }}>
                {lang === 'en' ? 'Interests' : lang === 'kz' ? 'Қызығушылықтар' : 'Интересы'} <span style={{ color: C.ink300, fontWeight: 400 }}>({lang === 'en' ? 'optional' : lang === 'kz' ? 'міндетті емес' : 'по желанию'})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {INTERESTS.map(i => {
                  const active = form.interests.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleInterest(i)}
                      style={{
                        padding: '6px 12px', borderRadius: 4, border: `1px solid ${active ? C.blue : C.hairline}`,
                        background: active ? C.blue100 : C.paper, color: active ? C.blue : C.ink700,
                        fontFamily: C.font, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 150ms',
                      }}
                    >
                      {i}
                    </button>
                  );
                })}
              </div>
            </div>
            {errors.grade && <div style={{ fontFamily: C.font, fontSize: 12, color: C.error700, marginBottom: 12 }}>{errors.grade}</div>}
          </>
        )}

        <Button variant="primary" size="lg" fullWidth onClick={nextStep} style={{ marginTop: 8 }}>
          {loading ? (lang === 'en' ? 'Loading...' : lang === 'kz' ? 'Жүктелуде...' : 'Загрузка...') : step === 1 ? t('auth_register_btn') : (lang === 'en' ? 'Continue' : lang === 'kz' ? 'Жалғастыру' : 'Продолжить')}
        </Button>

        {step === 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: C.hairline }} />
              <span style={{ fontFamily: C.font, fontSize: 12, color: C.ink300 }}>{t('auth_or')}</span>
              <div style={{ flex: 1, height: 1, background: C.hairline }} />
            </div>
            <button style={{
              width: '100%', padding: '11px 16px', borderRadius: 8, border: `1px solid ${C.hairline}`,
              background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: C.font, fontSize: 15, fontWeight: 600, color: C.ink900, cursor: 'pointer',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.06-.66-.15-1.17z" fill="#4285F4"/>
                <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.77-2.7.77-2.08 0-3.84-1.4-4.47-3.29H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"/>
                <path d="M4.51 10.53A4.8 4.8 0 0 1 4.26 9c0-.53.09-1.04.25-1.53V5.4H1.83A8 8 0 0 0 .98 9c0 1.3.31 2.52.85 3.6l2.68-2.07z" fill="#FBBC05"/>
                <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 .98 9l2.68 2.07C4.14 5.59 6.32 4.18 8.98 4.18z" fill="#EA4335"/>
              </svg>
              {lang === 'en' ? 'Register with Google' : lang === 'kz' ? 'Google арқылы тіркелу' : 'Зарегистрироваться через Google'}
            </button>
          </>
        )}
      </div>

      <p style={{ textAlign: 'center', fontFamily: C.font, fontSize: 14, color: C.ink500, marginTop: 24 }}>
        {t('auth_have_account')}{' '}
        <Link to="/login" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none' }}>{t('auth_login_link')}</Link>
      </p>
    </div>
  );
}
