import Icon from './Icon';

const SIZES = {
  sm: { padding: '6px 12px', fontSize: 13 },
  md: { padding: '10px 16px', fontSize: 14 },
  lg: { padding: '12px 20px', fontSize: 15 },
};

const VARIANTS = {
  primary:  { background: '#1448FF', color: 'white', border: 'none' },
  secondary:{ background: '#E6ECFF', color: '#1448FF', border: 'none' },
  ghost:    { background: 'transparent', color: '#0A1230', border: 'none' },
  outline:  { background: 'white', color: '#0A1230', border: '1px solid #E4E8F1' },
  ai:       { background: 'white', color: '#0A1230', border: '1px solid #E4E8F1', boxShadow: '0 0 0 4px rgba(20,72,255,0.06), 0 4px 16px rgba(34,211,238,0.16)' },
};

export default function Button({ children, variant = 'primary', size = 'md', icon, fullWidth, onClick, disabled, style = {} }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        ...SIZES[size],
        ...VARIANTS[variant],
        width: fullWidth ? '100%' : 'auto',
        borderRadius: 8,
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 200ms cubic-bezier(0.2,0.8,0.2,1)',
        ...style,
      }}
    >
      {variant === 'ai' && (
        <span style={{ width: 6, height: 6, borderRadius: 9999, background: 'linear-gradient(135deg,#22D3EE,#1448FF)' }} />
      )}
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}
