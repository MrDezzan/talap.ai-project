import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import Search from '../components/Search';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';
import Progress from '../components/Progress';
import Mesh from '../components/Mesh';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485',
  blue: '#1448FF', blue50: '#F2F5FF', blue100: '#E6ECFF',
  hairline: '#E4E8F1', mist: '#F5F7FB', mist2: '#ECEFF7',
  success700: '#047857', warn700: '#8A5A0E',
  mono: '"Geist Mono", "SF Mono", ui-monospace, monospace',
  font: 'var(--font-sans)',
};

function toneFor(deadline) {
  return deadline <= 14 ? 'warn' : '';
}

export default function Dashboard() {
  const { aiProfile, user } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'Студент';

  const stats = aiProfile
    ? [
        {
          label: t('dash_grants_match_label') || 'Подходящих грантов',
          value: String(aiProfile.grants?.length || 0),
          delta: `топ ${aiProfile.grants?.[0]?.match_percentage || 0}% ${t('cat_match')}`,
          icon: 'award',
        },
        {
          label: t('dash_prof_matched_label') || 'Профессий подобрано',
          value: String(aiProfile.professions?.length || 0),
          delta: aiProfile.top_profession || '',
          icon: 'compass',
        },
        {
          label: t('dash_roadmap_steps_label') || 'Шагов в маршруте',
          value: String(aiProfile.roadmap?.length || 0),
          delta: t('dash_personal_plan') || 'персональный план',
          icon: 'target',
        },
      ]
    : [
        { label: t('dash_grants_match_label') || 'Подходящих грантов', value: '—', delta: t('dash_auth_required'), icon: 'award' },
        { label: t('dash_prof_matched_label') || 'Профессий подобрано', value: '—', delta: '', icon: 'compass' },
        { label: t('dash_portfolio_ready_label') || 'Готовность портфолио', value: '—', delta: '', icon: 'trophy' },
      ];

  const topGrant = aiProfile?.grants?.[0];

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.mist, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        subtitle={`${t('dash_welcome')} ${firstName}`}
        title={t('dash_whats_new')}
        actions={
          <>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: 36, height: 36, borderRadius: 8, background: '#FFFFFF',
                  border: `1px solid ${C.hairline}`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer',
                }}
              >
                <Icon name="bell" size={16} color={C.ink700} />
              </button>
              <span style={{
                position: 'absolute', top: 8, right: 8, width: 6, height: 6,
                borderRadius: 9999, background: C.blue,
              }} />
              
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: 44, right: isMobile ? -60 : 0, width: isMobile ? 260 : 300, background: 'white',
                  borderRadius: 12, boxShadow: '0 10px 30px rgba(10,18,48,0.15)',
                  border: `1px solid ${C.hairline}`, zIndex: 100, padding: 12
                }}>
                  <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                    {t('dash_notifications')}
                    <span style={{ color: C.blue, fontSize: 11, cursor: 'pointer' }} onClick={() => setShowNotifications(false)}>{t('dash_close')}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { t: 'Твой роадмап обновлен', d: 'AI подобрал новые шаги для Data Scientist', i: 'sparkles' },
                      { t: 'Новый грант «Болашак»', d: 'Подходит под твой профиль на 92%', i: 'award' }
                    ].map((n, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: 10, borderRadius: 8, background: C.mist }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name={n.i} size={12} color={C.blue} />
                        </div>
                        <div>
                          <div style={{ fontFamily: C.font, fontSize: 12, fontWeight: 600, color: C.ink900 }}>{n.t}</div>
                          <div style={{ fontFamily: C.font, fontSize: 11, color: C.ink500, marginTop: 1 }}>{n.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        }
      />

      <div style={{ 
        padding: isMobile ? 16 : 32, 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
        gap: 24, 
        minHeight: 0 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <Mesh intensity={0.85} style={{ borderRadius: 16, padding: isMobile ? 20 : 28, minHeight: 200 }}>
            <Chip dot tone="ai" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)' }}>
              {t('grants_ai_tip')}
            </Chip>
            <div style={{
              fontFamily: C.font, fontSize: isMobile ? 22 : 26, fontWeight: 700, letterSpacing: '-0.025em',
              lineHeight: 1.2, marginTop: 16, maxWidth: 540, color: 'white',
            }}>
              {aiProfile
                ? (topGrant
                  ? `«${topGrant.name}» — ${t('cat_match')} ${topGrant.match_percentage}%`
                  : aiProfile.summary?.split('.')[0])
                : t('dash_hero_no_auth_title')}
            </div>
            <div style={{ fontFamily: C.font, fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 8, lineHeight: 1.6, maxWidth: 500 }}>
              {aiProfile
                ? (topGrant
                  ? topGrant.description || aiProfile.summary
                  : aiProfile.summary)
                : t('dash_hero_no_auth_desc')}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
              {aiProfile
                ? <>
                    <Button variant="primary" style={{ background: 'white', color: C.blue }} onClick={() => navigate('/grants')}>
                      {t('dash_view_grants')}
                    </Button>
                    <Button variant="ghost" icon="sparkles" style={{ color: 'white' }} onClick={() => navigate('/chat')}>
                      {t('cat_modal_ask_ai')}
                    </Button>
                  </>
                : <Button variant="primary" style={{ background: 'white', color: C.blue }} onClick={() => navigate('/quiz')}>
                    {t('cat_quiz_btn')}
                  </Button>
              }
            </div>
          </Mesh>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
            {stats.map((s, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: C.font, fontSize: 12, color: C.ink500, fontWeight: 500 }}>{s.label}</div>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: C.blue50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={s.icon} size={14} color={C.blue} />
                  </div>
                </div>
                <div style={{ fontFamily: C.font, fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: C.ink900, marginTop: 8 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: C.font, fontSize: 12, color: C.success700, marginTop: 4 }}>{s.delta}</div>
              </Card>
            ))}
          </div>

          {aiProfile?.grants?.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, letterSpacing: '-0.015em', color: C.ink900 }}>
                  {t('dash_grants_title')}
                </div>
                <span
                  onClick={() => navigate('/grants')}
                  style={{ fontFamily: C.font, fontSize: 13, color: C.blue, fontWeight: 600, cursor: 'pointer' }}
                >
                  {t('all')} →
                </span>
              </div>
              <Card padding={0} style={{ overflowX: 'auto' }}>
                {aiProfile.grants.map((g, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '16px 20px',
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : '1fr 100px 130px 100px',
                      gap: 16, alignItems: isMobile ? 'flex-start' : 'center',
                      borderBottom: i < aiProfile.grants.length - 1 ? `1px solid ${C.hairline}` : 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: C.font, fontSize: 14, fontWeight: 600, color: C.ink900 }}>{g.name}</div>
                      <div style={{ fontFamily: C.font, fontSize: 12, color: C.ink500, marginTop: 2 }}>{g.subtitle} · {g.country}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 600, color: C.ink900 }}>{g.match_percentage}%</div>
                      <Progress value={g.match_percentage} style={{ marginTop: 4 }} />
                    </div>
                    <Chip tone={g.tone || toneFor(g.deadline_days)} dot>
                      {t('dash_days_left')} {g.deadline_days} {t('days')}
                    </Chip>
                    <div style={{ display: isMobile ? 'none' : 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="outline" size="sm" onClick={() => navigate('/grants')}>{t('dash_open')}</Button>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {aiProfile?.professions?.length > 0 && (
            <div>
              <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, letterSpacing: '-0.015em', color: C.ink900, marginBottom: 14 }}>
                {t('dash_professions_title')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
                {aiProfile.professions.map((p, i) => (
                  <Card key={i} padding={18} onClick={() => navigate('/professions')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: C.blue50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="briefcase" size={18} color={C.blue} />
                      </div>
                      <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 700, color: C.blue }}>{p.match_percentage}%</span>
                    </div>
                    <div style={{ fontFamily: C.font, fontSize: 15, fontWeight: 700, color: C.ink900, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontFamily: C.font, fontSize: 12, color: C.ink500, lineHeight: 1.4, marginBottom: 10 }}>{p.description}</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {(p.tags || []).slice(0, 2).map(tag => (
                        <span key={tag} style={{ fontFamily: C.font, fontSize: 11, fontWeight: 600, color: C.blue, background: C.blue50, padding: '2px 8px', borderRadius: 4 }}>{tag}</span>
                      ))}
                    </div>
                    <Progress value={p.match_percentage} height={3} style={{ marginTop: 12 }} />
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Roadmap and others... */}

          {aiProfile?.roadmap?.length > 0 ? (
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Icon name="target" size={16} color={C.blue} />
                <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900 }}>{t('nav_roadmap')}</div>
              </div>
              {aiProfile.roadmap.slice(0, 3).map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: 14, marginBottom: i < 2 ? 14 : 0, borderBottom: i < 2 ? `1px solid ${C.hairline}` : 'none' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 9999, flexShrink: 0,
                    background: i === 0 ? C.blue : C.blue50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: i === 0 ? 'white' : C.blue }}>{s.step}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink900 }}>{s.title}</div>
                    <div style={{ fontFamily: C.font, fontSize: 11, color: C.ink500, marginTop: 2 }}>{s.duration}</div>
                  </div>
                </div>
              ))}
              <Button variant="primary" size="sm" style={{ marginTop: 4, width: '100%' }} onClick={() => navigate('/roadmap')}>
                {t('dash_full_roadmap')}
              </Button>
            </Card>
          ) : (
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="target" size={16} color={C.blue} />
                <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900 }}>{t('dash_quiz_promo_title')}</div>
              </div>
              <div style={{ fontFamily: C.font, fontSize: 16, fontWeight: 700, letterSpacing: '-0.015em', color: C.ink900, marginTop: 12 }}>
                {t('dash_quiz_promo_subtitle')}
              </div>
              <div style={{ fontFamily: C.font, fontSize: 12, color: C.ink500, marginTop: 4 }}>{t('dash_quiz_promo_stats')}</div>
              <Progress value={0} style={{ marginTop: 12 }} />
              <Button variant="primary" size="sm" style={{ marginTop: 14, width: '100%' }} onClick={() => navigate('/quiz')}>{t('dash_quiz_start')}</Button>
            </Card>
          )}

          {aiProfile?.grants?.length > 0 && (
            <Card>
              <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900, marginBottom: 12 }}>
                {t('dash_upcoming_deadlines')}
              </div>
              {[...aiProfile.grants]
                .sort((a, b) => a.deadline_days - b.deadline_days)
                .map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i ? `1px solid ${C.hairline}` : 'none' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 6,
                      background: g.deadline_days <= 14 ? '#FFF6E5' : C.blue50,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 700, color: g.deadline_days <= 14 ? C.warn700 : C.blue, lineHeight: 1 }}>
                        {g.deadline_days}
                      </div>
                      <div style={{ fontFamily: C.font, fontSize: 9, fontWeight: 600, color: g.deadline_days <= 14 ? C.warn700 : C.blue, textTransform: 'uppercase', marginTop: 2 }}>
                        {t('days_short')}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink900 }}>{g.name}</div>
                      <div style={{ fontFamily: C.font, fontSize: 11, color: C.ink500 }}>{g.amount || 'до дедлайна'}</div>
                    </div>
                  </div>
                ))}
            </Card>
          )}

            <Mesh intensity={0.45} style={{ borderRadius: 12, padding: 18 }}>
            <Chip dot tone="ai" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Talap AI</Chip>
            <div style={{ fontFamily: C.font, fontSize: 14, fontWeight: 600, color: 'white', marginTop: 10, lineHeight: 1.4 }}>
              {aiProfile?.summary
                ? aiProfile.summary
                : t('dash_ai_mesh_empty')}
            </div>
            <Button variant="ai" size="sm" icon="sparkles" style={{ marginTop: 12, width: '100%' }} onClick={() => navigate('/chat')}>
              {t('dash_ai_mesh_btn')}
            </Button>
          </Mesh>
        </div>
      </div>
    </div>
  );
}
