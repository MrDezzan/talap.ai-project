import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Progress from '../components/Progress';
import Mesh from '../components/Mesh';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485', ink300: '#9AA3BF',
  blue: '#1448FF', blue50: '#F2F5FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', mist: '#F5F7FB', mist2: '#ECEFF7', hairline: '#E4E8F1',
  error700: '#B42318', error100: '#FDECEC',
  font: 'var(--font-sans)',
};

const SECTIONS = [
  { id: 'profile', label: 'Профиль', icon: 'user' },
  { id: 'notifications', label: 'Уведомления', icon: 'bell' },
  { id: 'language', label: 'Язык', icon: 'globe' },
  { id: 'security', label: 'Безопасность', icon: 'settings' },
];

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 8,
          border: `1px solid ${focused ? C.blue : C.hairline}`,
          fontFamily: C.font, fontSize: 14, color: C.ink900, background: C.paper,
          outline: 'none', transition: 'border-color 150ms',
          boxShadow: focused ? '0 0 0 3px rgba(20,72,255,0.08)' : 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${C.hairline}` }}>
      <div>
        <div style={{ fontFamily: C.font, fontSize: 14, fontWeight: 600, color: C.ink900 }}>{label}</div>
        {hint && <div style={{ fontFamily: C.font, fontSize: 12, color: C.ink500, marginTop: 2 }}>{hint}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: checked ? C.blue : C.mist2, position: 'relative', flexShrink: 0,
          transition: 'background 200ms',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18,
          borderRadius: 9999, background: 'white',
          boxShadow: '0 1px 4px rgba(10,18,48,0.15)',
          transition: 'left 200ms cubic-bezier(0.2,0.8,0.2,1)',
        }} />
      </button>
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [activeLang, setActiveLang] = useState('ru');

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    grade: '',
    city: '',
    school: '',
    about: '',
  });

  const [notifs, setNotifs] = useState({
    grants: true,
    deadlines: true,
    ai: true,
    news: false,
    email: true,
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.mist, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Настройки" />

      <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8,
              background: activeSection === s.id ? C.blue50 : 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: C.font, fontSize: 14, fontWeight: activeSection === s.id ? 600 : 500,
              color: activeSection === s.id ? C.blue : C.ink700, textAlign: 'left',
            }}>
              <Icon name={s.icon} size={17} strokeWidth={activeSection === s.id ? 2 : 1.75} />
              {s.label}
            </button>
          ))}
          <div style={{ flex: 1, minHeight: 24 }} />
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: C.font, fontSize: 14, fontWeight: 500, color: C.error700, textAlign: 'left',
          }}>
            <Icon name="arrowRight" size={17} style={{ transform: 'rotate(180deg)' }} color={C.error700} />
            Выйти
          </button>
        </div>

        <div>
          {activeSection === 'profile' && (
            <Card padding={32}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 28, borderBottom: `1px solid ${C.hairline}` }}>
                <Avatar name={form.name} size={72} />
                <div>
                  <div style={{ fontFamily: C.font, fontSize: 20, fontWeight: 700, color: C.ink900 }}>{form.name}</div>
                  <div style={{ fontFamily: C.font, fontSize: 14, color: C.ink500, marginTop: 2 }}>{form.grade} · {form.city}</div>
                  <Button variant="outline" size="sm" style={{ marginTop: 10 }}>Сменить фото</Button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <Field label="Имя и фамилия" value={form.name} onChange={set('name')} placeholder="Имя Фамилия" />
                <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="email@example.kz" />
                <Field label="Класс / курс" value={form.grade} onChange={set('grade')} placeholder="11 класс" />
                <Field label="Город" value={form.city} onChange={set('city')} placeholder="Алматы" />
                <Field label="Школа / университет" value={form.school} onChange={set('school')} placeholder="Название учебного заведения" />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>О себе</label>
                <textarea
                  value={form.about}
                  onChange={e => setForm(f => ({ ...f, about: e.target.value }))}
                  placeholder="Расскажи коротко о себе, интересах и целях..."
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.hairline}`,
                    fontFamily: C.font, fontSize: 14, color: C.ink900, background: C.paper,
                    outline: 'none', resize: 'vertical', minHeight: 90, boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Button variant="primary" size="md" onClick={handleSave}>
                  {saved ? '✓ Сохранено' : 'Сохранить изменения'}
                </Button>
                <Button variant="outline" size="md">Отмена</Button>
              </div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card padding={28}>
              <div style={{ fontFamily: C.font, fontSize: 17, fontWeight: 700, color: C.ink900, marginBottom: 4 }}>Уведомления</div>
              <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500, marginBottom: 24 }}>Выбери, о чём хочешь получать уведомления</div>
              <Toggle label="Новые гранты" hint="Когда появляются гранты, подходящие твоему профилю" checked={notifs.grants} onChange={v => setNotifs(n => ({ ...n, grants: v }))} />
              <Toggle label="Дедлайны" hint="За 30, 14 и 7 дней до конца подачи" checked={notifs.deadlines} onChange={v => setNotifs(n => ({ ...n, deadlines: v }))} />
              <Toggle label="Советы Talap AI" hint="Персональные рекомендации от ассистента" checked={notifs.ai} onChange={v => setNotifs(n => ({ ...n, ai: v }))} />
              <Toggle label="Новости и статьи" hint="Карьерные материалы и истории успеха" checked={notifs.news} onChange={v => setNotifs(n => ({ ...n, news: v }))} />
              <Toggle label="Email-рассылка" hint="Еженедельный дайджест грантов" checked={notifs.email} onChange={v => setNotifs(n => ({ ...n, email: v }))} />
              <div style={{ marginTop: 24 }}>
                <Button variant="primary" size="md" onClick={handleSave}>{saved ? '✓ Сохранено' : 'Сохранить'}</Button>
              </div>
            </Card>
          )}

          {activeSection === 'language' && (
            <Card padding={28}>
              <div style={{ fontFamily: C.font, fontSize: 17, fontWeight: 700, color: C.ink900, marginBottom: 4 }}>Язык интерфейса</div>
              <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500, marginBottom: 24 }}>Talap поддерживает русский и казахский</div>
              {[
                { code: 'ru', label: 'Русский', native: 'Русский', flag: '🇷🇺' },
                { code: 'kz', label: 'Казахский', native: 'Қазақша', flag: '🇰🇿' },
              ].map((lang, i) => (
                <div key={lang.code} onClick={() => setActiveLang(lang.code)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 10,
                  border: `2px solid ${lang.code === activeLang ? C.blue : C.hairline}`,
                  background: lang.code === activeLang ? C.blue50 : C.paper,
                  cursor: 'pointer', marginBottom: 10, transition: 'all 150ms',
                }}>
                  <span style={{ fontSize: 24 }}>{lang.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: C.font, fontSize: 14, fontWeight: 700, color: C.ink900 }}>{lang.label}</div>
                    <div style={{ fontFamily: C.font, fontSize: 12, color: C.ink500 }}>{lang.native}</div>
                  </div>
                  {lang.code === activeLang && <Icon name="check" size={18} color={C.blue} strokeWidth={2.5} />}
                </div>
              ))}
            </Card>
          )}

          {activeSection === 'security' && (
            <Card padding={28}>
              <div style={{ fontFamily: C.font, fontSize: 17, fontWeight: 700, color: C.ink900, marginBottom: 24 }}>Безопасность</div>
              <div style={{ paddingBottom: 24, borderBottom: `1px solid ${C.hairline}`, marginBottom: 24 }}>
                <div style={{ fontFamily: C.font, fontSize: 15, fontWeight: 600, color: C.ink900, marginBottom: 4 }}>Сменить пароль</div>
                <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500, marginBottom: 16 }}>Используй надёжный пароль из 8+ символов</div>
                <Field label="Текущий пароль" type="password" value="" onChange={() => {}} placeholder="••••••••" />
                <Field label="Новый пароль" type="password" value="" onChange={() => {}} placeholder="Минимум 8 символов" />
                <Field label="Повтори новый пароль" type="password" value="" onChange={() => {}} placeholder="••••••••" />
                <Button variant="primary" size="sm">Сменить пароль</Button>
              </div>
              <div>
                <div style={{ fontFamily: C.font, fontSize: 15, fontWeight: 600, color: C.ink900, marginBottom: 4 }}>Удаление аккаунта</div>
                <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500, marginBottom: 16 }}>Все данные будут удалены без возможности восстановления</div>
                <Button variant="outline" size="sm" style={{ color: C.error700, borderColor: C.error700 }}>Удалить аккаунт</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
