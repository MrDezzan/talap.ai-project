import Icon from './Icon';

export default function Search({ placeholder = 'Найди грант, профессию или вуз...' }) {
  return (
    <div
      style={{
        width: 360,
        padding: '8px 14px',
        background: '#F5F7FB',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Icon name="search" size={16} color="#5A6485" />
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#9AA3BF', flex: 1 }}>
        {placeholder}
      </span>
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
