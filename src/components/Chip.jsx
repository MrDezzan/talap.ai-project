const TONES = {
  success: { bg: '#ECFAF3', fg: '#047857', dotC: '#6FCF97' },
  warn:    { bg: '#FFF6E5', fg: '#8A5A0E', dotC: '#F2C572' },
  ai:      { bg: 'white', fg: '#0A1230', border: '#E4E8F1' },
};

export default function Chip({ children, selected, tone, dot, onClick, style = {} }) {
  const t = TONES[tone];
  const base = selected
    ? { background: '#1448FF', color: 'white' }
    : t
      ? { background: t.bg, color: t.fg }
      : { background: '#F5F7FB', color: '#0A1230' };

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 4,
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        fontWeight: 600,
        border: t?.border ? `1px solid ${t.border}` : '1px solid transparent',
        cursor: onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        ...base,
        ...style,
      }}
    >
      {dot && (
        <span style={{
          width: 6,
          height: 6,
          borderRadius: 9999,
          background: tone === 'ai'
            ? 'linear-gradient(135deg,#22D3EE,#1448FF)'
            : (t?.dotC || '#1448FF'),
        }} />
      )}
      {children}
    </span>
  );
}
