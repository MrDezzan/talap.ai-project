export default function Mesh({ intensity = 0.7, children, className = '', style = {} }) {
  return (
    <div className={`relative isolate overflow-hidden ${className}`} style={style}>
      <div
        style={{
          position: 'absolute',
          inset: '-25%',
          zIndex: -1,
          background: `
            radial-gradient(50% 40% at 20% 30%, rgba(20,72,255,${0.55 * intensity}), transparent 70%),
            radial-gradient(45% 35% at 80% 25%, rgba(34,211,238,${0.50 * intensity}), transparent 70%),
            radial-gradient(60% 50% at 60% 90%, rgba(99,102,241,${0.45 * intensity}), transparent 70%),
            radial-gradient(40% 35% at 15% 85%, rgba(20,72,255,${0.40 * intensity}), transparent 70%)
          `,
          filter: 'blur(48px) saturate(115%)',
          opacity: 0.85,
          animation: 'ai-mesh-drift 18s cubic-bezier(0.2, 0.8, 0.2, 1) infinite alternate',
        }}
      />
      {children}
    </div>
  );
}
