import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Button from '../components/Button';
import Mesh from '../components/Mesh';
import { useAuth } from '../context/AuthContext';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485',
  blue: '#1448FF', blue50: '#F2F5FF', paper: '#FFFFFF',
  hairline: '#E4E8F1', mist: '#F5F7FB',
  success: '#6FCF97',
  font: 'var(--font-sans)',
};

function stateColor(state) {
  return state === 'done' ? C.success : state === 'active' ? C.blue : C.hairline;
}

export default function Roadmap() {
  const { aiProfile } = useAuth();
  const navigate = useNavigate();

  const steps = aiProfile?.roadmap || [];
  const topProfession = aiProfile?.top_profession || 'Карьерный путь';
  const summary = aiProfile?.summary || '';

  if (steps.length === 0) {
    return (
      <div style={{ flex: 1, overflow: 'auto', background: C.mist, display: 'flex', flexDirection: 'column' }}>
        <TopBar subtitle="Карьерный путь" title="Маршрут" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 48 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: C.blue50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="target" size={28} color={C.blue} strokeWidth={1.75} />
          </div>
          <div style={{ fontFamily: C.font, fontSize: 20, fontWeight: 700, color: C.ink900 }}>Маршрут ещё не построен</div>
          <div style={{ fontFamily: C.font, fontSize: 14, color: C.ink500, textAlign: 'center', maxWidth: 360 }}>
            Заполни профиль, чтобы Talap AI подобрал персональный карьерный путь
          </div>
          <Button variant="ai" icon="sparkles" onClick={() => navigate('/register')}>Создать профиль</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-container" style={{ flex: 1, overflow: 'auto', background: C.mist, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          #root > div > div:first-child { display: none !important; } /* Hide Sidebar */
          .no-print { display: none !important; }
          .roadmap-container { background: white !important; padding: 0 !important; }
          .roadmap-content { padding: 0 !important; gap: 40px !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
      `}</style>
      <TopBar
        subtitle="Карьерный путь"
        title={topProfession}
        actions={
          <>
            <Button className="no-print" variant="outline" icon="bookmark" onClick={() => window.print()}>Сохранить PDF</Button>
            <Button className="no-print" variant="ai" icon="sparkles" onClick={() => navigate('/chat')}>Скорректировать с Talap</Button>
          </>
        }
      />

      <div className="roadmap-content" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card padding={32}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            gap: 0,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 18, left: 18, right: 18, height: 2,
              background: C.hairline,
            }} />

            {steps.map((s, i) => {
              const state = i === 0 ? 'active' : 'next';
              return (
                <div key={i} style={{ position: 'relative', paddingRight: i < steps.length - 1 ? 16 : 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9999,
                    background: C.paper,
                    border: `2px solid ${stateColor(state)}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 1,
                    boxShadow: state === 'active' ? '0 0 0 6px rgba(20,72,255,0.12)' : 'none',
                  }}>
                    <span style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: stateColor(state) }}>{s.step}</span>
                  </div>

                  <div style={{
                    fontFamily: C.font, fontSize: 11, fontWeight: 600,
                    color: C.ink500, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 16,
                  }}>
                    {s.duration}
                  </div>
                  <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: C.ink900, marginTop: 4 }}>
                    {s.title}
                  </div>
                  <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink700, marginTop: 8, lineHeight: 1.5 }}>
                    {s.description}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {summary && (
          <Mesh intensity={0.45} style={{ borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name="sparkles" size={18} color={C.blue} strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.blue, letterSpacing: '0.02em' }}>
                  TALAP AI
                </div>
                <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 600, color: C.ink900, marginTop: 6, lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                  {summary}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <Button variant="primary" size="sm" onClick={() => navigate('/chat')}>Спросить AI</Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/grants')}>Посмотреть гранты</Button>
                </div>
              </div>
            </div>
          </Mesh>
        )}
      </div>
    </div>
  );
}
