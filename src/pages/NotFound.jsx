import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Icon from '../components/Icon';

const C = { ink900: '#0A1230', ink500: '#5A6485', blue: '#1448FF', font: 'var(--font-sans)' };

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
      <div style={{ fontFamily: '"Geist Mono",monospace', fontSize: 96, fontWeight: 800, color: '#E4E8F1', lineHeight: 1, marginBottom: 24 }}>404</div>
      <div style={{ fontFamily: C.font, fontSize: 24, fontWeight: 700, color: C.ink900, marginBottom: 8 }}>Страница не найдена</div>
      <div style={{ fontFamily: C.font, fontSize: 15, color: C.ink500, marginBottom: 32, maxWidth: 360 }}>
        Кажется, такой страницы нет. Возможно, ссылка устарела или была опечатка.
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Link to="/dashboard"><Button variant="primary" size="md" icon="home">На главную</Button></Link>
        <Link to="/"><Button variant="outline" size="md">На лендинг</Button></Link>
      </div>
    </div>
  );
}
