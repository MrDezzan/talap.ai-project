import { NavLink, Link } from 'react-router-dom';
import Icon from './Icon';
import Avatar from './Avatar';
import Button from './Button';
import logomark from '../assets/logomark.svg';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar() {
  const { user } = useAuth();
  const { lang, setLang, t } = useLanguage();
  
  const navItems = [
    { to: '/dashboard',   label: t('nav_home'),          icon: 'home' },
    { to: '/professions', label: t('nav_professions'),   icon: 'compass' },
    { to: '/grants',      label: t('nav_grants'),        icon: 'award' },
    { to: '/roadmap',     label: t('nav_roadmap'),       icon: 'target' },
    { to: '/portfolio',   label: t('nav_portfolio'),     icon: 'trophy' },
    { to: '/chat',        label: t('nav_chat'),          icon: 'sparkles' },
  ];

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  if (isMobile) {
    return (
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 64, background: '#FFFFFF', borderTop: '1px solid #E4E8F1',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0 8px', zIndex: 1000, boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
      }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              textDecoration: 'none', color: isActive ? '#1448FF' : '#5A6485',
              fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: isActive ? 600 : 500,
              flex: 1, padding: '8px 0'
            })}
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} size={20} strokeWidth={isActive ? 2 : 1.75} />
                <span style={{ fontSize: 10 }}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
        <Link to="/settings" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none', color: '#5A6485', flex: 1 }}>
          <Avatar name={user?.name || 'U'} size={20} />
          <span style={{ fontSize: 10 }}>{t('nav_settings')}</span>
        </Link>
      </nav>
    );
  }

  return (
    <aside style={{
      width: 240,
      height: '100%',
      background: '#FFFFFF',
      borderRight: '1px solid #E4E8F1',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <Link to="/dashboard" style={{ padding: '20px 16px 24px', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', cursor: 'pointer' }}>
        <img src={logomark} alt="Talap Logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: '#0A1230' }}>
          Talap<span style={{ color: '#1448FF' }}>.</span>ai
        </div>
      </Link>

      <nav style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              background: isActive ? '#F2F5FF' : 'transparent',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#1448FF' : '#2A3457',
              textDecoration: 'none',
              transition: 'background 150ms',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} size={18} strokeWidth={isActive ? 2 : 1.75} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      <div style={{ padding: '8px 16px', display: 'flex', gap: 4, marginBottom: 8 }}>
        {['ru', 'en', 'kz'].map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: 6,
              border: '1px solid ' + (lang === l ? '#1448FF' : '#E4E8F1'),
              background: lang === l ? '#F2F5FF' : 'white',
              color: lang === l ? '#1448FF' : '#5A6485',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 150ms'
            }}
          >
            {l}
          </button>
        ))}
      </div>


      <Link to="/settings" style={{ padding: '12px 16px', borderTop: '1px solid #E4E8F1', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <Avatar name={user?.name || 'U'} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: '#0A1230', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || t('nav_settings')}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: '#5A6485', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</div>
        </div>
        <Icon name="settings" size={16} color="#5A6485" />
      </Link>
    </aside>
  );
}
