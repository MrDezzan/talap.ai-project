import { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';
import Progress from '../components/Progress';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485', ink300: '#9AA3BF',
  blue: '#1448FF', blue50: '#F2F5FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', mist: '#F5F7FB', mist2: '#ECEFF7', hairline: '#E4E8F1',
  success700: '#047857', success100: '#ECFAF3', success500: '#6FCF97',
  error700: '#B42318', error100: '#FDECEC',
  font: 'var(--font-sans)',
};

const TONE = {
  blue:    { bg: '#E6ECFF', fg: '#1448FF' },
  iris:    { bg: '#EEF0FF', fg: '#6366F1' },
  amber:   { bg: '#FFF6E5', fg: '#8A5A0E' },
  success: { bg: '#ECFAF3', fg: '#047857' },
};

function ProfileModal({ onClose, onSave, initialData }) {
  const [bio, setBio] = useState(initialData.bio || '');
  const [ent, setEnt] = useState(initialData.ent || '');
  const [english, setEnglish] = useState(initialData.english || '');
  const [skills, setSkills] = useState(initialData.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    onSave({ ...initialData, bio, ent, english, skills });
    onClose();
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,18,48,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.paper, borderRadius: 20, width: '100%', maxWidth: 500, boxShadow: '0 32px 80px rgba(10,18,48,0.2)' }}>
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${C.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: C.font, fontSize: 18, fontWeight: 700, color: C.ink900 }}>Редактировать профиль</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: C.mist, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={16} color={C.ink500} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>О себе</label>
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              placeholder="Расскажи о своих интересах..."
              style={{ width: '100%', padding: 12, borderRadius: 8, border: `1px solid ${C.hairline}`, fontFamily: C.font, fontSize: 14, minHeight: 80, outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>Балл ЕНТ</label>
              <input value={ent} onChange={e => setEnt(e.target.value)} placeholder="Например: 132" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.hairline}`, fontFamily: C.font, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>Английский</label>
              <input value={english} onChange={e => setEnglish(e.target.value)} placeholder="Например: B2 (IELTS 6.5)" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.hairline}`, fontFamily: C.font, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>Навыки</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {skills.map(s => (
                <Chip key={s} onClick={() => setSkills(skills.filter(x => x !== s))}>{s} ✕</Chip>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input 
                value={newSkill} 
                onChange={e => setNewSkill(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addSkill()}
                placeholder="Добавить навык..."
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: `1px solid ${C.hairline}`, fontFamily: C.font, fontSize: 14, outline: 'none' }}
              />
              <Button size="sm" onClick={addSkill}>Добавить</Button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="outline" style={{ flex: 1 }} onClick={onClose}>Отмена</Button>
            <Button variant="primary" style={{ flex: 2 }} onClick={handleSave}>Сохранить изменения</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementModal({ onClose, onSave, onDelete, initialData }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [org, setOrg] = useState(initialData?.org || '');
  const [rank, setRank] = useState(initialData?.rank || '');
  const [year, setYear] = useState(initialData?.year || '2026');
  const [focused, setFocused] = useState('');

  const inputStyle = (name) => ({
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: `1px solid ${focused === name ? C.blue : C.hairline}`,
    fontFamily: C.font, fontSize: 14, color: C.ink900, background: C.paper,
    outline: 'none', transition: 'border-color 150ms', boxSizing: 'border-box',
    boxShadow: focused === name ? '0 0 0 3px rgba(20,72,255,0.08)' : 'none',
  });

  const handleSave = () => {
    if (!title || !org) return;
    onSave({ 
      id: initialData?.id || Date.now(), 
      title, 
      org, 
      year, 
      rank, 
      icon: initialData?.icon || 'bookOpen', 
      tone: initialData?.tone || 'blue' 
    });
    onClose();
  };

  const years = [];
  for (let y = 2030; y >= 2020; y--) years.push(String(y));

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,18,48,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.paper, borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: '0 32px 80px rgba(10,18,48,0.2)' }}>
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${C.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: C.font, fontSize: 18, fontWeight: 700, color: C.ink900 }}>
            {initialData ? 'Редактировать' : 'Добавить достижение'}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: C.mist, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={16} color={C.ink500} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>Название</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Олимпиада, курс, хакатон..." onFocus={() => setFocused('title')} onBlur={() => setFocused('')} style={inputStyle('title')} autoFocus />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>Организация</label>
              <input value={org} onChange={e => setOrg(e.target.value)} placeholder="Stepik, НУ..." onFocus={() => setFocused('org')} onBlur={() => setFocused('')} style={inputStyle('org')} />
            </div>
            <div>
              <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>Результат / Место</label>
              <input value={rank} onChange={e => setRank(e.target.value)} placeholder="1-е место, Победитель..." onFocus={() => setFocused('rank')} onBlur={() => setFocused('')} style={inputStyle('rank')} />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink700, display: 'block', marginBottom: 6 }}>Год</label>
            <select value={year} onChange={e => setYear(e.target.value)} style={{ ...inputStyle('year'), appearance: 'none', cursor: 'pointer' }}>
              {years.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {initialData && (
              <Button variant="outline" size="md" style={{ flex: 1, borderColor: '#FDA29B', color: '#B42318' }} onClick={() => { onDelete(initialData.id); onClose(); }}>
                Удалить
              </Button>
            )}
            <Button variant="primary" size="md" style={{ flex: initialData ? 2 : 1 }} onClick={handleSave}>
              {initialData ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState({ bio: '', skills: [], achievements: [] });
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  useEffect(() => {
    api.get('/api/portfolio')
      .then(d => { setPortfolio(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const savePortfolio = (updated) => {
    setPortfolio(updated);
    api.put('/api/portfolio', updated).then(() => {
      // Background regeneration of the roadmap
      api.post('/api/ai/analyze', {}).catch(console.error);
    }).catch(() => {});
  };

  const saveAchievement = (it) => {
    const safeAchievements = Array.isArray(portfolio.achievements) ? portfolio.achievements : [];
    const existingIdx = safeAchievements.findIndex(a => a.id === it.id);
    let newAchievements = [...safeAchievements];
    
    if (existingIdx >= 0) {
      newAchievements[existingIdx] = it;
    } else {
      newAchievements = [it, ...newAchievements];
    }

    savePortfolio({ ...portfolio, achievements: newAchievements });
  };

  const deleteAchievement = (id) => {
    const safeAchievements = Array.isArray(portfolio.achievements) ? portfolio.achievements : [];
    savePortfolio({ ...portfolio, achievements: safeAchievements.filter(a => a.id !== id) });
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (loading) return null;

  return (
    <div className="portfolio-container" style={{ flex: 1, overflow: 'auto', background: C.mist, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @media print {
          .top-bar, .no-print, button, .actions-row { display: none !important; }
          .portfolio-container { background: white !important; padding: 0 !important; }
          .grid-layout { display: block !important; }
          .sidebar-column { display: none !important; }
          .card-root { border: 1px solid #eee !important; box-shadow: none !important; margin-bottom: 20px !important; break-inside: avoid; }
        }
      `}</style>
      <div className="top-bar">
        <TopBar
          title="Портфолио"
          subtitle={user?.name || ''}
          actions={
            <div className="actions-row" style={{ display: 'flex', gap: 12 }}>
              <Button variant="outline" size="sm" icon="arrowRight" onClick={handleExportPDF}>Экспортировать PDF</Button>
              <Button variant="primary" size="sm" icon="plus" onClick={() => setShowAdd(true)}>Добавить</Button>
            </div>
          }
        />
      </div>

      <div className="grid-layout" style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
        <div>
          
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
            {[
              { v: '87%', l: 'Среднее совпадение' },
              { v: Array.isArray(portfolio.achievements) ? portfolio.achievements.length : 0, l: 'Достижения' },
              { v: Array.isArray(portfolio.skills) ? portfolio.skills.length : 0, l: 'Умений' },
              { v: '3', l: 'Гранта подходит' },
            ].map((s, i) => (
              <Card key={i} padding={16} className="card-root">
                <div style={{ fontFamily: C.font, fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', color: C.ink900 }}>{s.v}</div>
                <div style={{ fontFamily: C.font, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: C.ink500, marginTop: 4 }}>{s.l}</div>
              </Card>
            ))}
          </div>

          <Card padding={24} style={{ marginBottom: 24, position: 'relative' }} className="card-root">
            <div className="no-print" style={{ position: 'absolute', top: 32, right: 32 }}>
              <Button variant="outline" size="sm" icon="settings" onClick={() => setShowProfileEdit(true)}>Редактировать</Button>
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 32 }}>
              <Avatar name={user?.name} size={84} />
              <div>
                <div style={{ fontFamily: C.font, fontSize: 24, fontWeight: 800, color: C.ink900 }}>{user?.name}</div>
                <div style={{ fontFamily: C.font, fontSize: 15, color: C.ink500, marginTop: 4 }}>{user?.grade} · {user?.city}</div>
              </div>
            </div>
            
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, color: C.ink900, marginBottom: 12 }}>О себе</div>
              <p style={{ fontFamily: C.font, fontSize: 15, lineHeight: 1.6, color: C.ink700, margin: 0 }}>
                {portfolio.bio || 'Напиши пару слов о своих целях и интересах.'}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, color: C.ink900 }}>Умения</div>
                <Button variant="ghost" size="sm" className="no-print" style={{ color: C.blue, fontSize: 13 }} onClick={() => setShowProfileEdit(true)}>Редактировать</Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Array.isArray(portfolio.skills) && portfolio.skills.length > 0 
                  ? portfolio.skills.map(s => <Chip key={s}>{s}</Chip>) 
                  : <span style={{ color: C.ink300, fontSize: 14 }}>Навыки еще не добавлены</span>}
                <button className="no-print" onClick={() => setShowProfileEdit(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 4, border: `1px dashed ${C.blue}`, background: 'transparent', color: C.blue, fontFamily: C.font, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  <Icon name="plus" size={12} color={C.blue} /> Добавить
                </button>
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, color: C.ink900 }}>Достижения</div>
              <span style={{ fontFamily: C.font, fontSize: 13, color: C.ink500 }}>{Array.isArray(portfolio.achievements) ? portfolio.achievements.length : 0} записей</span>
            </div>
            <Button variant="secondary" size="sm" icon="plus" className="no-print" onClick={() => setShowAdd(true)}>Добавить</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.isArray(portfolio.achievements) ? portfolio.achievements.map(it => {
              const t = TONE[it.tone] || TONE.blue;
              return (
                <Card key={it.id} padding={18}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={it.icon} size={24} color={t.fg} strokeWidth={1.75} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: C.font, fontSize: 15, fontWeight: 700, color: C.ink900 }}>{it.title}</div>
                      <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500, marginTop: 2 }}>
                        {it.org}{it.rank ? ` · ${it.rank}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: '"Geist Mono",monospace', fontSize: 12, color: C.ink300 }}>{it.year}</span>
                      <button 
                        onClick={() => setEditingItem(it)}
                        style={{ width: 32, height: 32, borderRadius: 6, background: C.mist, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon name="edit" size={16} color={C.ink500} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            }) : null}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="target" size={15} color={C.blue} />
              Готовность для грантов
            </div>
            {[
              { label: 'Болашак', v: 87 },
              { label: 'NU Foundation', v: 74 },
              { label: 'Tech Excellence', v: 64 },
            ].map((g, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: C.font, fontSize: 12, color: C.ink700, fontWeight: 600 }}>{g.label}</span>
                  <span style={{ fontFamily: '"Geist Mono",monospace', fontSize: 11, fontWeight: 700, color: C.blue }}>{g.v}%</span>
                </div>
                <Progress value={g.v} height={4} />
              </div>
            ))}
            <Button variant="primary" size="sm" fullWidth style={{ marginTop: 4 }}>Посмотреть гранты</Button>
          </Card>

          <Card>
            <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 12 }}>Что добавить</div>
            {[
              { icon: 'graduation', text: 'Диплом или сертификат', hint: 'Увеличит match на 8%' },
              { icon: 'globe', text: 'Языковой сертификат', hint: 'Обязателен для Болашак' },
              { icon: 'briefcase', text: 'Стажировка или практика', hint: 'Выделит среди кандидатов' },
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderTop: i ? `1px solid ${C.hairline}` : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: C.blue50, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={tip.icon} size={16} color={C.blue} />
                </div>
                <div>
                  <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink900 }}>{tip.text}</div>
                  <div style={{ fontFamily: C.font, fontSize: 11, color: C.success700 }}>{tip.hint}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {showAdd && <AchievementModal onClose={() => setShowAdd(false)} onSave={saveAchievement} />}
      {editingItem && (
        <AchievementModal 
          initialData={editingItem} 
          onClose={() => setEditingItem(null)} 
          onSave={saveAchievement} 
          onDelete={deleteAchievement}
        />
      )}
      {showProfileEdit && (
        <ProfileModal 
          initialData={portfolio} 
          onClose={() => setShowProfileEdit(false)} 
          onSave={savePortfolio} 
        />
      )}
    </div>
  );
}
