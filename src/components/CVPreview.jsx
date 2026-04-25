import Icon from './Icon';

export default function CVPreview({ data }) {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ marginTop: 24, marginBottom: 24 }}>
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: 16, padding: '16px 20px', background: '#F5F7FB', 
        borderRadius: 16, border: '1px solid #E4E8F1' 
      }}>
        <div>
          <div style={{ fontWeight: 700, color: '#0A1230', fontSize: 15 }}>Ваше резюме готово!</div>
          <div style={{ color: '#5A6485', fontSize: 13, marginTop: 2 }}>Скачайте PDF или распечатайте</div>
        </div>
        <button 
          onClick={handlePrint}
          style={{ 
            background: '#1448FF', color: 'white', border: 'none', 
            padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600
          }}
        >
          <Icon name="download" size={16} color="white" />
          Скачать PDF
        </button>
      </div>

      <div className="cv-document" style={{
        background: 'white', padding: '40px', borderRadius: 12,
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        color: '#0A1230', fontFamily: '"Inter", sans-serif',
        lineHeight: 1.5, position: 'relative', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ borderBottom: '2px solid #0A1230', paddingBottom: 24, marginBottom: 24, textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 12px 0', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#0A1230' }}>
            {data.full_name || 'Имя Фамилия'}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', justifyContent: 'center', fontSize: 14, color: '#2A3457' }}>
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>{data.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, borderBottom: '1px solid #E4E8F1', paddingBottom: 6, color: '#0A1230' }}>О себе</h2>
            <p style={{ fontSize: 15, color: '#2A3457', margin: 0, lineHeight: 1.6 }}>{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, borderBottom: '1px solid #E4E8F1', paddingBottom: 6, color: '#0A1230' }}>Опыт работы</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#0A1230' }}>{exp.position}</div>
                    <div style={{ fontSize: 14, color: '#5A6485', fontWeight: 600 }}>{exp.period}</div>
                  </div>
                  <div style={{ fontSize: 15, fontStyle: 'italic', color: '#1448FF', marginBottom: 8, fontWeight: 600 }}>{exp.company}</div>
                  <p style={{ fontSize: 14, color: '#2A3457', margin: 0, lineHeight: 1.6 }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, borderBottom: '1px solid #E4E8F1', paddingBottom: 6, color: '#0A1230' }}>Образование</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {data.education.map((edu, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#0A1230', marginBottom: 2 }}>{edu.institution}</div>
                    <div style={{ fontSize: 15, color: '#2A3457' }}>{edu.degree}</div>
                  </div>
                  <div style={{ fontSize: 14, color: '#5A6485', fontWeight: 600 }}>{edu.period}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, borderBottom: '1px solid #E4E8F1', paddingBottom: 6, color: '#0A1230' }}>Навыки</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {data.skills.map((skill, i) => (
                <div key={i} style={{ background: '#F2F5FF', border: '1px solid #E6ECFF', padding: '6px 12px', borderRadius: 6, fontSize: 14, color: '#1448FF', fontWeight: 600 }}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .cv-document, .cv-document * { visibility: visible !important; }
          .cv-document { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            padding: 0 !important; 
            margin: 0 !important;
            box-shadow: none !important; 
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
