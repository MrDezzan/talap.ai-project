import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { useMobile } from '../hooks/useMobile';

export default function AppLayout() {
  const { user } = useAuth();
  const isMobile = useMobile();
  
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      flexDirection: isMobile ? 'column' : 'row',
      overflow: 'hidden',
      background: '#F5F7FB'
    }}>
      {!isMobile && <Sidebar />}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflowY: 'auto',
        paddingBottom: isMobile ? 64 : 0
      }}>
        <Outlet />
      </main>
      {isMobile && <Sidebar />}
    </div>
  );
}
