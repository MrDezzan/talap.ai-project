export default function Progress({ value = 0, color = '#1448FF', height = 6, style = {} }) {
  return (
    <div style={{ width: '100%', height, background: '#ECEFF7', borderRadius: 9999, overflow: 'hidden', ...style }}>
      <div
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: '100%',
          background: color,
          borderRadius: 9999,
          transition: 'width 480ms cubic-bezier(0.2,0.8,0.2,1)',
        }}
      />
    </div>
  );
}
