import { NavLink, Link } from 'react-router-dom';
import Icon from './Icon';
import Avatar from './Avatar';
import Mesh from './Mesh';
import Button from './Button';
import logomark from '../assets/logomark.svg';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard',   label: 'Лента',          icon: 'home' },
  { to: '/professions', label: 'Профессии',       icon: 'compass' },
  { to: '/grants',      label: 'Гранты',          icon: 'award' },
  { to: '/roadmap',     label: 'Карьерный путь',  icon: 'target' },
  { to: '/portfolio',   label: 'Портфолио',       icon: 'trophy' },
  { to: '/chat',        label: 'AI-чат',          icon: 'sparkles' },
];

export default function Sidebar() {
  const { user } = useAuth();
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
        {NAV_ITEMS.map(item => (
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

      <div style={{ padding: '8px 8px 12px' }}>
        <Mesh intensity={0.5} style={{ borderRadius: 12, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="sparkles" size={14} color="#1448FF" strokeWidth={2} />
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: '#0A1230' }}>Talap Pro</div>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#2A3457', marginTop: 4, lineHeight: '16px' }}>
            Открой все AI-возможности
          </div>
          <Button variant="primary" size="sm" style={{ marginTop: 10, width: '100%' }}>Открыть</Button>
        </Mesh>
      </div>

      <Link to="/settings" style={{ padding: '12px 16px', borderTop: '1px solid #E4E8F1', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <Avatar name={user?.name || 'U'} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: '#0A1230', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Профиль'}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: '#5A6485', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</div>
        </div>
        <Icon name="settings" size={16} color="#5A6485" />
      </Link>
    </aside>
  );
}
