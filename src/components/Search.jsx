import { useEffect, useRef } from 'react';
import Icon from './Icon';

export default function Search({ placeholder = 'Найди грант, профессию или вуз...', value, onChange, onEnter }) {
  const inputRef = useRef(null);

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

  const handleKey = (e) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  };

  return (
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
      onBlur={e => { e.currentTarget.style.background = '#F5F7FB'; e.currentTarget.style.borderColor = 'transparent'; }}
    >
      <Icon name="search" size={16} color="#5A6485" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={handleKey}
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
    </div>
  );
}
