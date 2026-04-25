export default function Card({ children, padding = 20, onClick, className = '', style = {} }) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: '#FFFFFF',
        borderRadius: 12,
        padding,
        border: '1px solid #E4E8F1',
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'transform 80ms cubic-bezier(0.2,0.8,0.2,1)' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
