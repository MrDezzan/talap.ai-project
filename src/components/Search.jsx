import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Search({ placeholder: propsPlaceholder, value: propsValue, onChange: propsOnChange, onEnter }) {
  const { t } = useLanguage();
  const placeholder = propsPlaceholder || t('search_placeholder');
  const [internalValue, setInternalValue] = useState('');
  const isControlled = propsValue !== undefined;
  const value = isControlled ? propsValue : internalValue;
  const setValue = isControlled ? propsOnChange : setInternalValue;

  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const query = value?.trim();
    if (!query) {
      setResults(null);
      setShowResults(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(data);
        setShowResults(true);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [value]);

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      if (onEnter) onEnter(value);
      else navigate(`/professions?q=${value}`);
      setShowResults(false);
    }
  };

  const handleSelect = (type, item) => {
    const path = type === 'profession' ? `/professions?q=${item.name}` : `/grants?q=${item.name}`;
    navigate(path);
    setShowResults(false);
    if (!isControlled) setValue('');
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          width: 360,
          padding: '0 14px',
          background: '#F5F7FB',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 36,
          border: '1px solid transparent',
          transition: 'all 200ms',
        }}
        onFocus={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#1448FF'; }}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
      >
        <Icon name="search" size={16} color="#5A6485" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => value?.trim() && setShowResults(true)}
          onClick={() => value?.trim() && setShowResults(true)}
          style={{
            border: 'none',
            outline: 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: '#0A1230',
            background: 'transparent',
            flex: 1,
            height: '100%',
          }}
        />
        {loading ? (
          <div style={{ width: 14, height: 14, borderRadius: 7, border: '2px solid #E4E8F1', borderTopColor: '#1448FF', animation: 'spin 1s linear infinite' }} />
        ) : (
          <span 
            onClick={() => inputRef.current?.focus()}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: '#9AA3BF',
              padding: '2px 6px',
              border: '1px solid #E4E8F1',
              borderRadius: 4,
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >⌘K</span>
        )}
      </div>

      {showResults && (
        <div style={{
          position: 'absolute', top: 42, left: 0, right: 0, background: 'white',
          borderRadius: 12, boxShadow: '0 10px 40px rgba(10,18,48,0.18)',
          border: '1px solid #E4E8F1', zIndex: 1000, overflow: 'hidden',
          animation: 'fadeIn 150ms ease-out'
        }}>
          {results?.professions?.length > 0 && (
            <div style={{ borderBottom: '1px solid #F5F7FB' }}>
              <div style={{ padding: '12px 14px 6px', fontSize: 10, fontWeight: 700, color: '#9AA3BF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('nav_professions')}</div>
              {results.professions.map(p => (
                <div 
                  key={p.id} 
                  onMouseDown={() => handleSelect('profession', p)}
                  style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 150ms' }} 
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F7FB'} 
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#F2F5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="briefcase" size={14} color="#1448FF" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0A1230' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#5A6485' }}>{p.category}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {results?.grants?.length > 0 && (
            <div style={{ borderBottom: '1px solid #F5F7FB' }}>
              <div style={{ padding: '12px 14px 6px', fontSize: 10, fontWeight: 700, color: '#9AA3BF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('nav_grants')}</div>
              {results.grants.map(g => (
                <div 
                  key={g.id} 
                  onMouseDown={() => handleSelect('grant', g)}
                  style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 150ms' }} 
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F7FB'} 
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#ECFAF3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="award" size={14} color="#047857" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0A1230' }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: '#5A6485' }}>{g.country} · {g.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div 
            onMouseDown={() => handleKey({ key: 'Enter' })}
            style={{ padding: '12px 14px', background: '#F9FAFC', borderTop: '1px solid #F5F7FB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          >
            <div style={{ fontSize: 12, color: '#5A6485' }}>
              {t('search_everywhere')} <span style={{ fontWeight: 600, color: '#0A1230' }}>«{value}»</span> {t('search_all_site')}
            </div>
            <div style={{ fontSize: 11, color: '#9AA3BF', fontFamily: 'var(--font-mono)' }}>ENTER ↵</div>
          </div>

          {(!results?.professions?.length && !results?.grants?.length) && (
            <div style={{ padding: '24px 14px', textAlign: 'center' }}>
              <Icon name="search" size={20} color="#E4E8F1" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13, color: '#5A6485' }}>{t('search_not_found')}</div>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
