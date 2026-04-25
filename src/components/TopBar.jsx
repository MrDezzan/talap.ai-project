export default function TopBar({ title, subtitle, actions }) {
  return (
    <div style={{
      padding: '20px 32px',
      borderBottom: '1px solid #E4E8F1',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexShrink: 0,
    }}>
      <div>
        {subtitle && (
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#5A6485',
          }}>
            {subtitle}
          </div>
        )}
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.015em',
          color: '#0A1230',
          marginTop: subtitle ? 4 : 0,
        }}>
          {title}
        </div>
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {actions}
        </div>
      )}
    </div>
  );
}
