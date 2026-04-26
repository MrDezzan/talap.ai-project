import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useLanguage } from '../context/LanguageContext';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485',
  blue: '#1448FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', hairline: '#E4E8F1',
  error700: '#B42318', success700: '#047857', success100: '#ECFAF3',
  font: 'var(--font-sans)',
};

export default function ForgotPassword() {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) { setError(lang === 'en' ? 'Enter email' : lang === 'kz' ? 'Email енгізіңіз' : 'Введи email'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError(lang === 'en' ? 'Invalid email' : lang === 'kz' ? 'Email қате' : 'Некорректный email'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: C.blue100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Icon name="bell" size={26} color={C.blue} strokeWidth={1.75} />
        </div>
        <h1 style={{ fontFamily: C.font, fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em', color: C.ink900, margin: '0 0 8px' }}>
          {lang === 'en' ? 'Password Recovery' : lang === 'kz' ? 'Құпия сөзді қалпына келтіру' : 'Восстановление пароля'}
        </h1>
        <p style={{ fontFamily: C.font, fontSize: 15, color: C.ink500, margin: 0 }}>
          {lang === 'en' ? 'We will send reset link to your email' : lang === 'kz' ? 'Email-іңізге құпия сөзді өзгерту сілтемесін жібереміз' : 'Отправим ссылку для сброса на твой email'}
        </p>
      </div>

      <div style={{ background: C.paper, borderRadius: 16, padding: 32, border: `1px solid ${C.hairline}`, boxShadow: '0 8px 32px rgba(10,18,48,0.06)' }}>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 9999, background: C.success100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="check" size={28} color={C.success700} strokeWidth={2.5} />
            </div>
            <div style={{ fontFamily: C.font, fontSize: 17, fontWeight: 700, color: C.ink900, marginBottom: 8 }}>
              {lang === 'en' ? 'Email sent' : lang === 'kz' ? 'Хат жіберілді' : 'Письмо отправлено'}
            </div>
            <div style={{ fontFamily: C.font, fontSize: 14, color: C.ink500, marginBottom: 24, lineHeight: 1.6 }}>
              {lang === 'en' ? <>Check <strong>{email}</strong> for reset link. It should arrive in 2 mins.</> : 
               lang === 'kz' ? <><strong>{email}</strong> поштасын тексеріңіз — онда сілтеме бар. Хат 2 минут ішінде келеді.</> :
               <>Проверь <strong>{email}</strong> — там ссылка для сброса пароля. Письмо придёт в течение 2 минут.</>}
            </div>
            <Link to="/login">
              <Button variant="primary" size="md" fullWidth>{t('auth_login_link')}</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>
                {t('auth_email_label')}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="твой@email.kz"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoFocus
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 8,
                  border: `1px solid ${error ? C.error700 : focused ? C.blue : C.hairline}`,
                  fontFamily: C.font, fontSize: 15, color: C.ink900, background: C.paper,
                  outline: 'none', transition: 'border-color 150ms',
                  boxShadow: focused ? '0 0 0 3px rgba(20,72,255,0.08)' : 'none',
                  boxSizing: 'border-box',
                }}
              />
              {error && <div style={{ fontFamily: C.font, fontSize: 12, color: C.error700, marginTop: 4 }}>{error}</div>}
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? (lang === 'en' ? 'Sending...' : lang === 'kz' ? 'Жіберілуде...' : 'Отправляем...') : (lang === 'en' ? 'Send Link' : lang === 'kz' ? 'Сілтемені жіберу' : 'Отправить ссылку')}
            </Button>
          </form>
        )}
      </div>

      <p style={{ textAlign: 'center', fontFamily: C.font, fontSize: 14, color: C.ink500, marginTop: 24 }}>
        <Link to="/login" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {lang === 'en' ? 'Back to Login' : lang === 'kz' ? 'Кіруге оралу' : 'Вернуться ко входу'}
        </Link>
      </p>
    </div>
  );
}
