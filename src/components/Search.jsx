import Icon from './Icon';

export default function Search({ placeholder = 'Найди грант, профессию или вуз...', value, onChange }) {
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
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
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
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: '#9AA3BF',
        padding: '2px 6px',
        border: '1px solid #E4E8F1',
        borderRadius: 4,
      }}>⌘K</span>
    </div>
  );
}
