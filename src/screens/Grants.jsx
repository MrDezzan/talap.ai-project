import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';
import Search from '../components/Search';
import Progress from '../components/Progress';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485', ink300: '#9AA3BF',
  blue: '#1448FF', blue50: '#F2F5FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', mist: '#F5F7FB', mist2: '#ECEFF7', hairline: '#E4E8F1',
  success700: '#047857', success100: '#ECFAF3',
  warn700: '#8A5A0E', warn100: '#FFF6E5',
  font: 'var(--font-sans)',
  mono: '"Geist Mono", monospace',
};

function GrantDetailModal({ grant, onClose, t, lang }) {
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
              {tags.map(tag => <Chip key={tag}>{tag}</Chip>)}
            </div>
            <h2 style={{ fontFamily: C.font, fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink900, margin: '0 0 4px' }}>
              {grant.name}
            </h2>
            <div style={{ fontFamily: C.font, fontSize: 14, color: C.ink500 }}>{grant.subtitle} · {grant.country}</div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, background: C.mist, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="plus" size={18} color={C.ink500} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        <div style={{ padding: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
            {[
              { label: t('grants_amount'), value: grant.amount },
              { label: t('grants_deadline'), value: `${grant.deadline_days} ${t('days') || 'дн.'}`, tone: grant.tone === 'warn' ? 'warn' : null },
              { label: 'Match', value: `${grant.match_percentage}%`, tone: 'success' },
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
            <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, color: C.ink900, marginBottom: 8 }}>{t('grants_about')}</div>
            <p style={{ fontFamily: C.font, fontSize: 14, lineHeight: '22px', color: C.ink700, margin: 0 }}>{grant.description}</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, color: C.ink900, marginBottom: 12 }}>{t('grants_requirements')}</div>
            {(grant.tags || []).map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? `1px solid ${C.hairline}` : 'none' }}>
                <div style={{ width: 20, height: 20, borderRadius: 9999, background: C.blue100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="check" size={10} color={C.blue} strokeWidth={2.5} />
                </div>
                <span style={{ fontFamily: C.font, fontSize: 14, color: C.ink900 }}>{r}</span>
              </div>
            ))}
          </div>

          <div style={{ borderRadius: 12, padding: 16, marginBottom: 24, background: C.mist }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 9999, background: 'white', boxShadow: '0 0 0 3px rgba(20,72,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="sparkles" size={14} color={C.blue} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900 }}>{t('grants_ai_tip')}</div>
                <div style={{ fontFamily: C.font, fontSize: 13, lineHeight: '20px', color: C.ink700, marginTop: 2 }}>
                  {t('grants_ai_tip_desc')}
                </div>
              </div>
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth icon="arrowRight">{t('grants_apply')}</Button>
        </div>
      </div>
    </div>
  );
}

export default function Grants() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [grants, setGrants] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [search, setSearch] = useState('');

  const FILTERS = [
    { key: 'all', label: t('cat_all') },
    { key: 'Бакалавриат', label: t('grants_bachelor') },
    { key: 'Магистратура', label: t('grants_master') },
    { key: 'IT', label: 'IT' },
    { key: 'Бизнес', label: t('cat_business') },
    { key: 'За рубежом', label: t('grants_abroad') },
    { key: 'Казахстан', label: t('grants_kz') },
  ];

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('q');
    if (query) setSearch(query);

    Promise.all([
      api.get('/grants'),
      api.get('/portfolio')
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
    const matchFilter = activeFilter === 'all' || (g.tags && g.tags.includes(activeFilter));
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) || (g.subtitle && g.subtitle.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.mist, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title={t('grants_title')}
        subtitle={`${grants.length} ${t('grants_subtitle')}`}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search value={search} onChange={setSearch} placeholder={t('grants_search')} />
          </div>
        }
      />

      <div style={{ padding: 32 }}>
        
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <Chip key={f.key} selected={activeFilter === f.key} onClick={() => setActiveFilter(f.key)}>{f.label}</Chip>
          ))}
          <div style={{ flex: 1 }} />
          <Chip dot tone="ai" onClick={() => navigate('/chat')}>{t('grants_ai_match')}</Chip>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(g => (
              <Card key={g.id} onClick={() => setSelectedGrant(g)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                      {(g.tags || ['Грант']).map(tag => <Chip key={tag}>{tag}</Chip>)}
                    </div>
                    <div style={{ fontFamily: C.font, fontSize: 17, fontWeight: 700, letterSpacing: '-0.015em', color: C.ink900, marginBottom: 4 }}>{g.name}</div>
                    <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500 }}>{g.subtitle} · {g.country}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 4 }}>{g.match_percentage}% match</div>
                    <div style={{ fontFamily: C.font, fontSize: 12, color: g.tone === 'warn' ? C.warn700 : C.ink500, marginBottom: 8 }}>
                      {g.deadline_days} {t('grants_deadline')}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="target" size={16} color={C.blue} />
                {t('grants_match_profile')}
              </div>
              {[
                { label: 'ЕНТ', value: portfolio.ent || '-', bar: portfolio.ent ? (parseInt(portfolio.ent)/140)*100 : 0 },
                { label: 'English', value: portfolio.english || '-', bar: portfolio.english ? 80 : 0 },
              ].map((s, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: C.font, fontSize: 12, color: C.ink500 }}>{s.label}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: C.ink900 }}>{s.value}</span>
                  </div>
                  <Progress value={s.bar} height={4} />
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>

      {selectedGrant && <GrantDetailModal grant={selectedGrant} t={t} lang={lang} onClose={() => setSelectedGrant(null)} />}
    </div>
  );
}
