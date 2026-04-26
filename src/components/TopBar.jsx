import { useMobile } from '../hooks/useMobile';

export default function TopBar({ title, subtitle, actions }) {
  const isMobile = useMobile();

  return (
    <div style={{
      padding: isMobile ? '12px 16px' : '20px 32px',
      borderBottom: '1px solid #E4E8F1',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexShrink: 0,
      flexWrap: 'wrap',
    }}>
      <div style={{ minWidth: 0 }}>
        {subtitle && (
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#5A6485',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {subtitle}
          </div>
        )}
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: isMobile ? 18 : 22,
          fontWeight: 700,
          letterSpacing: '-0.015em',
          color: '#0A1230',
          marginTop: subtitle ? 4 : 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {title}
        </div>
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
