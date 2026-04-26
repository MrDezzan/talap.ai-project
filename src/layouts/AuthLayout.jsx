import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMobile } from '../hooks/useMobile';
import logomark from '../assets/logomark.svg';

export default function AuthLayout() {
  const { user } = useAuth();
  const isMobile = useMobile();
  
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div style={{
      minHeight: '100vh', background: '#ECEFF7',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: isMobile ? '16px 20px' : '24px 40px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src={logomark} alt="Talap Logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: '#0A1230' }}>
            Talap<span style={{ color: '#1448FF' }}>.</span>ai
          </span>
        </Link>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '12px 16px 32px' : '24px 16px 48px' }}>
        <Outlet />
      </div>
    </div>
  );
}
