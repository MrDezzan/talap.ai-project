import appIcon from '../assets/app-icon.svg';

const TONES = {
  blue: { bg: '#E6ECFF', fg: '#1448FF' },
  iris: { bg: '#EEF0FF', fg: '#6366F1' },
  ai: { bg: '#1448FF', fg: '#FFFFFF' },
};

export default function Avatar({ name = 'A', size = 32, tone = 'blue', image }) {
  const t = TONES[tone] || TONES.blue;
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  if (tone === 'ai' && !image) {
    return (
      <img 
        src={appIcon} 
        alt="Talap AI" 
        style={{ 
          width: size, 
          height: size, 
          borderRadius: size * 0.3,
          flexShrink: 0,
          objectFit: 'cover'
        }} 
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        background: image ? 'transparent' : t.bg,
        color: t.fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: size * 0.4,
        letterSpacing: '-0.01em',
        flexShrink: 0,
        overflow: 'hidden'
      }}
    >
      {image ? (
        <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials
      )}
    </div>
  );
}
