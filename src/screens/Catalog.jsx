import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import Search from '../components/Search';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485',
  blue: '#1448FF', blue50: '#F2F5FF',
  hairline: '#E4E8F1', mist: '#F5F7FB',
  success700: '#047857', warn700: '#8A5A0E',
  font: 'var(--font-sans)',
};

function ProfessionModal({ profession, onClose, onAskAI, t }) {
  if (!profession) return null;
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
          background: '#FFFFFF', borderRadius: 20, width: '100%', maxWidth: 540,
          maxHeight: '80vh', overflow: 'auto',
          boxShadow: '0 32px 80px rgba(10,18,48,0.2)',
        }}
      >
        <div style={{ padding: '28px 28px 20px', borderBottom: `1px solid ${C.hairline}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {(profession.tags || []).map(tag => <Chip key={tag}>{tag}</Chip>)}
            </div>
            <h2 style={{ fontFamily: C.font, fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink900, margin: '0 0 4px' }}>
              {profession.name}
            </h2>
            <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500 }}>{profession.category}</div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, background: C.mist, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="plus" size={18} color={C.ink500} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: t('cat_match'), value: `${profession.match_percentage || 0}%` },
              { label: t('cat_salary'), value: profession.salary || '-' },
              { label: t('cat_growth'), value: profession.growth || '-' },
            ].map((s, i) => (
              <div key={i} style={{ background: C.mist, borderRadius: 10, padding: 14 }}>
                <div style={{ fontFamily: C.font, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: C.ink500 }}>{s.label}</div>
                <div style={{ fontFamily: '"Geist Mono",monospace', fontSize: 16, fontWeight: 700, color: C.ink900, marginTop: 4 }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 8 }}>{t('cat_modal_about')}</div>
            <p style={{ fontFamily: C.font, fontSize: 14, lineHeight: '20px', color: C.ink700, margin: 0 }}>{profession.description}</p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="outline" size="md" style={{ flex: 1 }} icon="sparkles" onClick={onAskAI}>
              {t('cat_modal_ask_ai')}
            </Button>
            <Button variant="primary" size="md" style={{ flex: 2 }} icon="arrowRight">
              {t('cat_modal_build_path')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Catalog() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [search, setSearch] = useState('');

  const CATEGORIES = [
    { key: 'all', label: t('cat_all') },
    { key: 'IT и данные', label: t('cat_it') },
    { key: 'Дизайн', label: t('cat_design') },
    { key: 'Бизнес', label: t('cat_business') },
    { key: 'Наука', label: t('cat_science') },
    { key: 'Образование', label: t('cat_edu') },
    { key: 'Медицина', label: t('cat_med') },
    { key: 'Инженерия', label: t('cat_eng') },
  ];

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('q');
    if (query) setSearch(query);

    api.get('/api/professions')
      .then(d => { 
        setProfessions(d); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  const filtered = professions.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.mist, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title={t('cat_title')}
        actions={
          <>
            <Search value={search} onChange={setSearch} placeholder={t('cat_search_label')} />
            <Button variant="primary" icon="sparkles" size="md" onClick={() => navigate('/quiz')}>{t('cat_quiz_btn')}</Button>
          </>
        }
      />

      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {CATEGORIES.map(cat => (
            <Chip
              key={cat.key}
              selected={activeCategory === cat.key}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </Chip>
          ))}
          <div style={{ flex: 1 }} />
          <Chip dot tone="ai" onClick={() => navigate('/chat')}>{t('cat_ai_sort')}</Chip>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filtered.map((p, i) => (
            <Card key={i} onClick={() => setSelectedProfession(p)} style={{ position: 'relative', cursor: 'pointer' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: C.blue50,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="briefcase" size={22} color={C.blue} strokeWidth={2} />
              </div>
              <div style={{ fontFamily: C.font, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: C.ink900, marginTop: 14 }}>
                {p.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Icon name="sparkles" size={12} color={C.blue} />
                <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 12, fontWeight: 600, color: C.blue }}>
                  {p.match_percentage || 0}% {t('cat_match')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.hairline}` }}>
                <div>
                  <div style={{ fontFamily: C.font, fontSize: 11, color: C.ink500 }}>{t('cat_salary')}</div>
                  <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink900, marginTop: 2 }}>{p.salary}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: C.font, fontSize: 11, color: C.ink500 }}>{t('cat_growth')}</div>
                  <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.success700, marginTop: 2 }}>{p.growth}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedProfession && (
        <ProfessionModal
          profession={selectedProfession}
          t={t}
          onClose={() => setSelectedProfession(null)}
          onAskAI={() => { setSelectedProfession(null); navigate('/chat'); }}
        />
      )}
    </div>
  );
}
