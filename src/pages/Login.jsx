import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/Button';
import Icon from '../components/Icon';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485', ink300: '#9AA3BF',
  blue: '#1448FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', mist: '#F5F7FB', hairline: '#E4E8F1',
  error700: '#B42318', error100: '#FDECEC',
  font: 'var(--font-sans)',
};

function Field({ label, type = 'text', value, onChange, placeholder, error, autoFocus }) {
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
          boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(180,35,24,0.08)' : 'rgba(20,72,255,0.08)'}` : 'none',
          boxSizing: 'border-box',
        }}
      />
      {error && <div style={{ fontFamily: C.font, fontSize: 12, color: C.error700, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Введи email';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Некорректный email';
    if (!password) e.password = 'Введи пароль';
    else if (password.length < 6) e.password = 'Минимум 6 символов';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.token) {
        navigate('/dashboard');
      } else {
        setErrors({ email: res.error || 'Ошибка входа' });
      }
    } catch (err) {
      setErrors({ email: 'Ошибка сервера' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: C.font, fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', color: C.ink900, margin: '0 0 8px' }}>
          {t('auth_welcome')}
        </h1>
        <p style={{ fontFamily: C.font, fontSize: 15, color: C.ink500, margin: 0 }}>
          {t('auth_login_subtitle')}
        </p>
      </div>

      <div style={{ background: C.paper, borderRadius: 16, padding: 32, border: `1px solid ${C.hairline}`, boxShadow: '0 8px 32px rgba(10,18,48,0.06)' }}>
        <form onSubmit={handleSubmit} noValidate>
          <Field
            label={t('auth_email_label')}
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
            placeholder="твой@email.kz"
            error={errors.email}
            autoFocus
          />
          <Field
            label={t('auth_pass_label')}
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
            placeholder="••••••••"
            error={errors.password}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20, marginTop: -8 }}>
            <Link to="/forgot-password" style={{ fontFamily: C.font, fontSize: 13, color: C.blue, fontWeight: 600, textDecoration: 'none' }}>
              {t('auth_forgot_pass')}
            </Link>
          </div>
          <Button variant="primary" size="lg" fullWidth onClick={handleSubmit} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? t('auth_logging_in') : t('auth_login_btn')}
          </Button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
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
          {t('auth_google')}
        </button>
      </div>

      <p style={{ textAlign: 'center', fontFamily: C.font, fontSize: 14, color: C.ink500, marginTop: 24 }}>
        {t('auth_no_account')}{' '}
        <Link to="/register" style={{ color: C.blue, fontWeight: 600, textDecoration: 'none' }}>
          {t('auth_register_link')}
        </Link>
      </p>
    </div>
  );
}
