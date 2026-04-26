import { useState, useEffect } from 'react';
import { useMobile } from '../hooks/useMobile';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485',
  blue: '#1448FF', blue50: '#F2F5FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', mist: '#F5F7FB', hairline: '#E4E8F1',
  font: 'var(--font-sans)',
};

export default function Roadmap() {
  const navigate = useNavigate();
  const { aiProfile } = useAuth();
  const { t, lang } = useLanguage();
  const steps = aiProfile?.roadmap || [];
  const isMobile = useMobile();

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.mist, display: 'flex', flexDirection: 'column' }}>
      <TopBar title={t('nav_roadmap')} />

      <div style={{ padding: isMobile ? '16px' : '40px', maxWidth: 800, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {steps.length > 0 ? (
          <>
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontFamily: C.font, fontSize: 14, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                {t('dash_roadmap_title')}
              </div>
              <h1 style={{ fontFamily: C.font, fontSize: 32, fontWeight: 800, color: C.ink900, letterSpacing: '-0.03em', margin: 0 }}>
                {aiProfile.top_profession}
              </h1>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 23, top: 40, bottom: 40, width: 2, background: C.blue100 }} />
              
              {steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 32, marginBottom: 48, position: 'relative' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 24, background: 'white', border: `2px solid ${C.blue}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: '0 4px 12px rgba(20,72,255,0.1)'
                  }}>
                    <span style={{ fontFamily: C.font, fontSize: 18, fontWeight: 800, color: C.blue }}>{i + 1}</span>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <Card style={{ padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <h3 style={{ fontFamily: C.font, fontSize: 18, fontWeight: 700, color: C.ink900, margin: 0 }}>{step.title}</h3>
                        {step.duration && (
                          <div style={{ padding: '4px 10px', borderRadius: 6, background: C.blue50, color: C.blue, fontFamily: '"Geist Mono",monospace', fontSize: 12, fontWeight: 700 }}>
                            {step.duration}
                          </div>
                        )}
                      </div>
                      <p style={{ fontFamily: C.font, fontSize: 14, lineHeight: '22px', color: C.ink700, margin: 0 }}>
                        {step.description}
                      </p>
                      
                      {step.resources && (
                        <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {step.resources.map((res, j) => (
                            <div key={j} style={{ padding: '6px 12px', borderRadius: 8, background: C.mist, border: `1px solid ${C.hairline}`, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                              <Icon name="compass" size={14} color={C.ink500} />
                              <span style={{ fontFamily: C.font, fontSize: 12, fontWeight: 600, color: C.ink700 }}>{res}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.blue50 }}>
              <Icon name="target" size={40} color={C.blue} strokeWidth={1.5} />
            </div>
            <h2 style={{ fontFamily: C.font, fontSize: 24, fontWeight: 800, color: C.ink900, marginBottom: 16 }}>{t('dash_roadmap_empty')}</h2>
            <Button variant="primary" size="lg" onClick={() => navigate('/portfolio')}>{t('port_go_to')}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
