import { useState } from 'react';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485',
  blue: '#1448FF', blue50: '#F2F5FF',
  hairline: '#E4E8F1', mist: '#F5F7FB',
  font: 'var(--font-sans)',
};

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    grade: user?.grade || '',
    city: user?.city || '',
    school: user?.school || '',
  });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await updateUser(formData);
    setLoading(false);
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.mist, display: 'flex', flexDirection: 'column' }}>
      <TopBar title={t('settings_title')} />

      <div style={{ padding: 32, maxWidth: 800 }}>
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <Avatar name={formData.name} size={64} />
                <div>
                  <div style={{ fontFamily: C.font, fontSize: 20, fontWeight: 800, color: C.ink900 }}>{formData.name}</div>
                  <div style={{ fontFamily: C.font, fontSize: 14, color: C.ink500 }}>{user?.email}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: t('settings_name'), key: 'name' },
                  { label: t('settings_grade'), key: 'grade' },
                  { label: t('settings_city'), key: 'city' },
                  { label: t('settings_school'), key: 'school' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontFamily: C.font, fontSize: 12, fontWeight: 700, color: C.ink500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {f.label}
                    </label>
                    <input
                      value={formData[f.key]}
                      onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.hairline}`,
                        fontFamily: C.font, fontSize: 14, color: C.ink900, background: '#FFFFFF', outline: 'none',
                      }}
                    />
                  </div>
                ))}
              </div>

              <Button variant="primary" style={{ marginTop: 24 }} onClick={save} loading={loading}>{t('port_save')}</Button>
            </Card>

            <Card>
              <h3 style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, color: C.ink900, marginBottom: 16 }}>{t('settings_lang')}</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { id: 'ru', label: 'Русский' },
                  { id: 'en', label: 'English' },
                  { id: 'kz', label: 'Қазақша' },
                ].map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${lang === l.id ? C.blue : C.hairline}`,
                      background: lang === l.id ? C.blue50 : 'white', color: lang === l.id ? C.blue : C.ink700,
                      fontFamily: C.font, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 200ms',
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card style={{ border: '1px solid #FFEDED' }}>
              <Button variant="ghost" fullWidth style={{ color: '#FF4D4D' }} icon="plus" onClick={logout}>
                {t('settings_logout')}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
