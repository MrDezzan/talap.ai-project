import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';
import Progress from '../components/Progress';
import Mesh from '../components/Mesh';
import { api } from '../lib/api';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485', ink300: '#9AA3BF',
  blue: '#1448FF', blue50: '#F2F5FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', mist: '#F5F7FB', mist2: '#ECEFF7', hairline: '#E4E8F1',
  success700: '#047857', success100: '#ECFAF3',
  warn700: '#8A5A0E', warn100: '#FFF6E5',
  font: 'var(--font-sans)',
  mono: '"Geist Mono", monospace',
};

const FILTERS = ['Все', 'Бакалавриат', 'Магистратура', 'IT', 'Бизнес', 'За рубежом', 'Казахстан'];

function GrantDetailModal({ grant, onClose }) {
  if (!grant) return null;
  const tags = grant.tags || ['Грант'];
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,18,48,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, backdropFilter: 'blur(4px)', padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.paper, borderRadius: 20, width: '100%', maxWidth: 640,
          maxHeight: '85vh', overflow: 'auto',
          boxShadow: '0 32px 80px rgba(10,18,48,0.2)',
        }}
      >
        <div style={{ padding: 32, borderBottom: `1px solid ${C.hairline}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {tags.map(t => <Chip key={t}>{t}</Chip>)}
              {grant.urgent && <Chip tone="warn" dot>Срочно</Chip>}
            </div>
            <h2 style={{ fontFamily: C.font, fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink900, margin: '0 0 4px' }}>
              {grant.name}
            </h2>
            <div style={{ fontFamily: C.font, fontSize: 14, color: C.ink500 }}>{grant.subtitle} · {grant.country || 'Казахстан'}</div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, background: C.mist, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="plus" size={18} color={C.ink500} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        <div style={{ padding: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
            {[
              { label: 'Сумма', value: grant.amount },
              { label: 'До дедлайна', value: `${grant.deadline} дн.`, tone: grant.urgent ? 'warn' : null },
              { label: 'Совпадение', value: `${grant.match}%`, tone: 'success' },
            ].map((s, i) => (
              <div key={i} style={{ background: C.mist, borderRadius: 10, padding: 14 }}>
                <div style={{ fontFamily: C.font, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: C.ink500 }}>{s.label}</div>
                <div style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 700, color: s.tone === 'warn' ? C.warn700 : s.tone === 'success' ? C.success700 : C.ink900, marginTop: 4 }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, color: C.ink900, marginBottom: 8 }}>О гранте</div>
            <p style={{ fontFamily: C.font, fontSize: 14, lineHeight: '22px', color: C.ink700, margin: 0 }}>{grant.description || grant.desc}</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, color: C.ink900, marginBottom: 12 }}>Требования</div>
            {(grant.req || grant.tags || []).map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? `1px solid ${C.hairline}` : 'none' }}>
                <div style={{ width: 20, height: 20, borderRadius: 9999, background: C.blue100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="check" size={10} color={C.blue} strokeWidth={2.5} />
                </div>
                <span style={{ fontFamily: C.font, fontSize: 14, color: C.ink900 }}>{r}</span>
              </div>
            ))}
          </div>

          <Mesh intensity={0.5} style={{ borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 9999, background: 'white', boxShadow: '0 0 0 3px rgba(20,72,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="sparkles" size={14} color={C.blue} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900 }}>Talap советует</div>
                <div style={{ fontFamily: C.font, fontSize: 13, lineHeight: '20px', color: C.ink700, marginTop: 2 }}>
                  Начни с IELTS — без него заявку не примут. Я подобрал 3 курса в твоём городе.
                </div>
              </div>
            </div>
          </Mesh>

          <Button variant="primary" size="lg" fullWidth icon="arrowRight">Подать заявку</Button>
        </div>
      </div>
    </div>
  );
}

export default function Grants() {
  const navigate = useNavigate();
  const [grants, setGrants] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Все');
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/api/grants'),
      api.get('/api/portfolio')
    ])
      .then(([grantsData, portfolioData]) => {
        setGrants(grantsData);
        setPortfolio(portfolioData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  const filtered = grants.filter(g => {
    const matchFilter = activeFilter === 'Все' || (g.tags && g.tags.includes(activeFilter));
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) || (g.subtitle && g.subtitle.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.mist, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Гранты и стипендии"
        subtitle={`${grants.length} актуальных предложений`}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: '0 14px', height: 36 }}>
              <Icon name="search" size={15} color={C.ink500} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск грантов..."
                style={{ border: 'none', outline: 'none', fontFamily: C.font, fontSize: 13, color: C.ink900, background: 'transparent', width: 200 }}
              />
            </div>
            <Button variant="outline" icon="filter" size="sm">Фильтры</Button>
          </div>
        }
      />

      <div style={{ padding: 32 }}>
        
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <Chip key={f} selected={activeFilter === f} onClick={() => setActiveFilter(f)}>{f}</Chip>
          ))}
          <div style={{ flex: 1 }} />
          <Chip dot tone="ai" onClick={() => navigate('/chat')}>AI-подбор по профилю</Chip>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(g => (
              <Card key={g.id} onClick={() => setSelectedGrant(g)} style={{ cursor: 'pointer', transition: 'box-shadow 150ms' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                      {(g.tags || ['Грант']).map(t => <Chip key={t}>{t}</Chip>)}
                      {g.tone === 'warn' && <Chip tone="warn" dot>Срочно</Chip>}
                    </div>
                    <div style={{ fontFamily: C.font, fontSize: 17, fontWeight: 700, letterSpacing: '-0.015em', color: C.ink900, marginBottom: 4 }}>{g.name}</div>
                    <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500 }}>{g.subtitle} · {g.country || 'Казахстан'}</div>
                    <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink700, marginTop: 8, lineHeight: 1.5 }}>{g.description || ''}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 4 }}>{g.match_percentage}% match</div>
                    <div style={{ fontFamily: C.font, fontSize: 12, color: g.tone === 'warn' ? C.warn700 : C.ink500, marginBottom: 8 }}>
                      {g.deadline_days} дн. до дедлайна
                    </div>
                    <Button variant="outline" size="sm">Подробнее</Button>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Progress value={g.match_percentage} height={3} />
                </div>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Icon name="search" size={40} color={C.ink300} />
                <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 600, color: C.ink500, marginTop: 12 }}>Ничего не найдено</div>
                <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink300, marginTop: 4 }}>Попробуй другой фильтр или поисковый запрос</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="target" size={16} color={C.blue} />
                Твой match-профиль
              </div>
              {[
                { label: 'ЕНТ', value: portfolio.ent || 'Не указано', bar: portfolio.ent ? Math.min(100, (parseInt(portfolio.ent) / 140) * 100) : 0 },
                { label: 'Английский', value: portfolio.english || 'Не указано', bar: portfolio.english ? 80 : 0 },
                { label: 'Портфолио', value: `${(portfolio.achievements || []).length} достижения`, bar: Math.min(100, (portfolio.achievements || []).length * 20) },
              ].map((s, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: C.font, fontSize: 12, color: C.ink500 }}>{s.label}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: C.ink900 }}>{s.value}</span>
                  </div>
                  <Progress value={s.bar} height={4} />
                </div>
              ))}
              <Button variant="secondary" size="sm" fullWidth style={{ marginTop: 4 }} onClick={() => navigate('/portfolio')}>Улучшить профиль</Button>
            </Card>

            <Mesh intensity={0.45} style={{ borderRadius: 12, padding: 18 }}>
              <Chip dot tone="ai">Talap AI</Chip>
              <div style={{ fontFamily: C.font, fontSize: 14, fontWeight: 600, color: C.ink900, marginTop: 10, lineHeight: 1.5 }}>
                Хочешь — подберу дедлайны и составлю план подготовки к грантам на следующие 3 месяца?
              </div>
              <Button variant="ai" size="sm" icon="sparkles" style={{ marginTop: 12, width: '100%' }}>Составить план</Button>
            </Mesh>

            <Card>
              <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 12 }}>Ближайшие дедлайны</div>
              {grants.filter(g => g.deadline_days <= 30).sort((a, b) => a.deadline_days - b.deadline_days).map((g, i) => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? `1px solid ${C.hairline}` : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: g.tone === 'warn' ? C.warn100 : C.blue50, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 700, color: g.tone === 'warn' ? C.warn700 : C.blue }}>{g.deadline_days}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: C.font, fontSize: 12, fontWeight: 600, color: C.ink900 }}>{g.name}</div>
                    <div style={{ fontFamily: C.font, fontSize: 11, color: C.ink500 }}>дней осталось</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>

      {selectedGrant && <GrantDetailModal grant={selectedGrant} onClose={() => setSelectedGrant(null)} />}
    </div>
  );
}
