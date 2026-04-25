const TONES = {
  blue: { bg: '#E6ECFF', fg: '#1448FF' },
  iris: { bg: '#EEF0FF', fg: '#6366F1' },
};

export default function Avatar({ name = 'A', size = 32, tone = 'blue' }) {
  const t = TONES[tone] || TONES.blue;
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        background: t.bg,
        color: t.fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: size * 0.4,
        letterSpacing: '-0.01em',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
