import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Mesh from '../components/Mesh';
import Button from '../components/Button';
import Chip from '../components/Chip';
import logomark from '../assets/logomark.svg';
import appIcon from '../assets/app-icon.svg';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485', ink300: '#9AA3BF',
  blue: '#1448FF', blue50: '#F2F5FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', mist: '#F5F7FB', mist2: '#ECEFF7', hairline: '#E4E8F1',
  success700: '#047857', success100: '#ECFAF3',
  font: 'var(--font-sans)',
};

function Navbar() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${C.hairline}`,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', gap: 40 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <img src={appIcon} alt="Talap Logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontFamily: C.font, fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink900 }}>
            Talap<span style={{ color: C.blue }}>.</span>ai
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          {['Возможности', 'Как работает', 'Гранты', 'Об нас'].map(item => (
            <a key={item} href={`#${item}`} style={{
              fontFamily: C.font, fontSize: 14, fontWeight: 500, color: C.ink700,
              padding: '6px 12px', borderRadius: 6, textDecoration: 'none',
              transition: 'color 150ms',
            }}>{item}</a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/login">
            <Button variant="ghost" size="sm" style={{ color: C.ink700 }}>Войти</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Начать бесплатно</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const navigate = useNavigate();
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes talap-blob-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33%       { transform: translate(90px, -70px) scale(1.12) rotate(130deg); }
          66%       { transform: translate(-60px, 80px) scale(0.92) rotate(260deg); }
        }
        @keyframes talap-blob-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          40%       { transform: translate(-110px, 60px) scale(1.18) rotate(-150deg); }
          75%       { transform: translate(70px, -90px) scale(0.88) rotate(-300deg); }
        }
        @keyframes talap-blob-3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%       { transform: translate(50px, 70px) scale(1.22); }
        }
      `}</style>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '5%', left: '15%',
          width: 720, height: 380,
          background: 'radial-gradient(ellipse, rgba(20,72,255,0.13) 0%, transparent 68%)',
          filter: 'blur(48px)',
          animation: 'talap-blob-1 16s ease-in-out infinite',
          transformOrigin: 'center center',
        }} />
        <div style={{
          position: 'absolute', top: '35%', right: '5%',
          width: 520, height: 580,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.09) 0%, transparent 68%)',
          filter: 'blur(64px)',
          animation: 'talap-blob-2 22s ease-in-out infinite',
          transformOrigin: 'center center',
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', left: '2%',
          width: 420, height: 360,
          background: 'radial-gradient(ellipse, rgba(20,72,255,0.07) 0%, transparent 68%)',
          filter: 'blur(56px)',
          animation: 'talap-blob-3 11s ease-in-out infinite alternate',
          transformOrigin: 'center center',
        }} />
      </div>

      <section style={{ padding: '96px 40px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 9999, background: C.blue100, marginBottom: 24 }}>
              <Icon name="sparkles" size={14} color={C.blue} />
              <span style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.blue }}>AI-ассистент для карьеры</span>
            </div>
            <h1 style={{ fontFamily: C.font, fontSize: 56, lineHeight: '60px', fontWeight: 800, letterSpacing: '-0.035em', color: C.ink900, margin: '0 0 24px' }}>
              Найди свой путь<br />
              <span style={{ color: C.blue }}>с помощью AI</span>
            </h1>
            <p style={{ fontFamily: C.font, fontSize: 18, lineHeight: '28px', color: C.ink700, margin: '0 0 40px', maxWidth: 480 }}>
              Talap подберёт профессию, найдёт подходящие гранты и поможет построить карьерный путь — на основе твоих интересов и достижений.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register">
                <Button variant="primary" size="lg" icon="arrowRight">Начать бесплатно</Button>
              </Link>
              <a href="#how">
                <Button variant="outline" size="lg">Как это работает</Button>
              </a>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
              {[
                { value: '50 000+', label: 'студентов' },
                { value: '1 200+', label: 'грантов в базе' },
                { value: '95%', label: 'находят путь' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: C.font, fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em', color: C.ink900 }}>{s.value}</div>
                  <div style={{ fontFamily: C.font, fontSize: 13, color: C.ink500, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -24, borderRadius: 32,
              background: 'radial-gradient(60% 60% at 50% 50%, rgba(20,72,255,0.08), transparent)',
            }} />
            <Mesh intensity={0.6} style={{
              borderRadius: 20, padding: 24,
              boxShadow: '0 32px 80px rgba(10,18,48,0.14), 0 0 0 1px rgba(10,18,48,0.06)',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9999, background: 'white', boxShadow: '0 0 0 3px rgba(20,72,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="sparkles" size={16} color={C.blue} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontFamily: C.font, fontSize: 13, fontWeight: 700, color: C.ink900 }}>Talap</div>
                  <div style={{ fontFamily: C.font, fontSize: 11, color: C.success700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: 9999, background: '#6FCF97' }} />
                    На связи
                  </div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <div style={{ fontFamily: C.font, fontSize: 14, color: C.ink900, lineHeight: 1.5 }}>
                  На основе твоих результатов (ЕНТ 132, профиль: математика) подобрал 3 направления:
                </div>
                {[
                  { name: 'Data-аналитик', m: 92 },
                  { name: 'AI Engineer', m: 87 },
                  { name: 'Product-менеджер', m: 74 },
                ].map(p => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <span style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink900 }}>{p.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 4, background: C.mist2, borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ width: `${p.m}%`, height: '100%', background: C.blue, borderRadius: 9999 }} />
                      </div>
                      <span style={{ fontFamily: '"Geist Mono",monospace', fontSize: 11, fontWeight: 600, color: C.blue, width: 32 }}>{p.m}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Chip onClick={() => navigate('/grants')}>Найти гранты</Chip>
                <Chip onClick={() => navigate('/roadmap')}>Построить путь</Chip>
              </div>
            </Mesh>
          </div>
        </div>
      </section>
    </div>
  );
}

const FEATURES = [
  {
    icon: 'compass',
    title: 'Профориентация',
    desc: 'Пройди тест из 24 вопросов — получи список профессий с процентом совпадения с твоим профилем.',
    color: C.blue,
    bg: C.blue100,
  },
  {
    icon: 'award',
    title: 'Гранты и стипендии',
    desc: '1 200+ актуальных грантов в Казахстане и за рубежом. AI подбирает по твоим оценкам и направлению.',
    color: '#047857',
    bg: '#ECFAF3',
  },
  {
    icon: 'target',
    title: 'Карьерный путь',
    desc: 'Пошаговый roadmap от школы до первой работы. С конкретными курсами, дедлайнами и чекпоинтами.',
    color: '#6366F1',
    bg: '#EEF0FF',
  },
  {
    icon: 'trophy',
    title: 'Портфолио достижений',
    desc: 'Собери олимпиады, курсы, хакатоны в одном месте. Экспортируй для заявки на грант одним кликом.',
    color: '#8A5A0E',
    bg: '#FFF6E5',
  },
  {
    icon: 'sparkles',
    title: 'AI-ассистент Talap',
    desc: 'Спроси что угодно о карьере, вузах или грантах. Отвечает на русском и казахском, помнит твой профиль.',
    color: C.blue,
    bg: C.blue50,
  },
  {
    icon: 'bell',
    title: 'Дедлайны и напоминания',
    desc: 'Никогда не пропустишь важный срок. Умные уведомления за 30, 14 и 7 дней до дедлайна.',
    color: '#B42318',
    bg: '#FDECEC',
  },
];

function Features() {
  return (
    <section id="Возможности" style={{ padding: '80px 40px', background: C.mist }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Chip>Возможности</Chip>
          <h2 style={{ fontFamily: C.font, fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink900, margin: '16px 0 16px' }}>
            Всё что нужно для старта карьеры
          </h2>
          <p style={{ fontFamily: C.font, fontSize: 17, color: C.ink700, maxWidth: 520, margin: '0 auto' }}>
            От выбора профессии до первого оффера — Talap ведёт тебя на каждом шаге.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: C.paper, borderRadius: 16, padding: 28, border: `1px solid ${C.hairline}`, transition: 'transform 200ms, box-shadow 200ms' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Icon name={f.icon} size={24} color={f.color} strokeWidth={1.75} />
              </div>
              <div style={{ fontFamily: C.font, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: C.ink900, marginBottom: 10 }}>{f.title}</div>
              <div style={{ fontFamily: C.font, fontSize: 14, lineHeight: '22px', color: C.ink500 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: '01', title: 'Расскажи о себе', desc: 'Заполни профиль: класс, оценки, интересы. Занимает 3 минуты.' },
  { n: '02', title: 'Пройди тест', desc: '24 вопроса — и Talap AI подберёт профессии с процентом совпадения.' },
  { n: '03', title: 'Получи план', desc: 'Персональный roadmap с курсами, грантами и дедлайнами.' },
  { n: '04', title: 'Действуй', desc: 'Подавай заявки, собирай портфолио, задавай вопросы AI.' },
];

function HowItWorks() {
  return (
    <section id="how" style={{ padding: '80px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Chip>Как работает</Chip>
          <h2 style={{ fontFamily: C.font, fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink900, margin: '16px 0 16px' }}>
            Четыре шага до карьеры мечты
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 1, background: `linear-gradient(90deg, ${C.blue}, ${C.blue}66)` }} />
          {STEPS.map((s, i) => (
            <div key={i} style={{ padding: '0 20px', textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 9999, background: i === 0 ? C.blue : C.paper,
                border: `2px solid ${i === 0 ? C.blue : C.hairline}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                fontFamily: '"Geist Mono",monospace', fontSize: 15, fontWeight: 700,
                color: i === 0 ? 'white' : C.ink500,
                position: 'relative', zIndex: 1,
              }}>{s.n}</div>
              <div style={{ fontFamily: C.font, fontSize: 17, fontWeight: 700, color: C.ink900, marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontFamily: C.font, fontSize: 14, lineHeight: '22px', color: C.ink500 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    text: 'Благодаря Talap нашла грант Болашак и поступила в магистратуру в Великобритании. Ассистент помог собрать все документы.',
    name: 'Айгерим Нурланова',
    role: 'Студентка University of Edinburgh',
    tone: 'blue',
  },
  {
    text: 'Тест профориентации показал Data Science — сначала не верил. Сейчас стажёр в Kaspi.kz. Talap знал лучше меня.',
    name: 'Даниял Сейткали',
    role: 'Студент НУ, стажёр Kaspi.kz',
    tone: 'iris',
  },
  {
    text: 'Карьерный roadmap разложил всё по полочкам. Я знал что сдавать, где учиться и как строить портфолио. Это бесценно.',
    name: 'Алибек Джаксыбеков',
    role: 'Выпускник, разработчик в Chocofamily',
    tone: 'amber',
  },
];

const TONE_STYLES = {
  blue:  { bg: '#E6ECFF', fg: '#1448FF' },
  iris:  { bg: '#EEF0FF', fg: '#6366F1' },
  amber: { bg: '#FFF6E5', fg: '#8A5A0E' },
};

function Testimonials() {
  return (
    <section style={{ padding: '80px 40px', background: C.mist }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Chip tone="success" dot>Истории успеха</Chip>
          <h2 style={{ fontFamily: C.font, fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink900, margin: '16px 0 0' }}>
            Они уже нашли свой путь
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: C.paper, borderRadius: 16, padding: 28, border: `1px solid ${C.hairline}` }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {[...Array(5)].map((_, j) => (
                  <Icon key={j} name="star" size={16} color="#F2C572" strokeWidth={0} style={{ fill: '#F2C572' }} />
                ))}
              </div>
              <p style={{ fontFamily: C.font, fontSize: 15, lineHeight: '24px', color: C.ink700, margin: '0 0 20px' }}>
                «{t.text}»
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 9999,
                  background: TONE_STYLES[t.tone].bg, color: TONE_STYLES[t.tone].fg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: C.font, fontWeight: 700, fontSize: 16,
                }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontFamily: C.font, fontSize: 14, fontWeight: 700, color: C.ink900 }}>{t.name}</div>
                  <div style={{ fontFamily: C.font, fontSize: 12, color: C.ink500 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section style={{ padding: '80px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Mesh intensity={0.9} style={{ borderRadius: 24, padding: '64px 80px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: C.font, fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink900, margin: '0 0 16px' }}>
            Начни прямо сейчас — бесплатно
          </h2>
          <p style={{ fontFamily: C.font, fontSize: 17, color: C.ink700, margin: '0 0 36px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Более 50 000 студентов уже строят карьеру с Talap. Присоединяйся.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/register">
              <Button variant="primary" size="lg" icon="arrowRight">Создать профиль</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Уже есть аккаунт</Button>
            </Link>
          </div>
        </Mesh>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.ink900, padding: '56px 40px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src={logomark} alt="Talap Logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
              <span style={{ fontFamily: C.font, fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>
                Talap<span style={{ color: C.blue }}>.</span>ai
              </span>
            </div>
            <p style={{ fontFamily: C.font, fontSize: 14, lineHeight: '22px', color: '#9AA3BF', maxWidth: 280, margin: 0 }}>
              AI-ассистент для карьеры школьников и студентов Казахстана. На русском и казахском.
            </p>
          </div>
          {[
            { title: 'Продукт', links: [['Возможности', '#Возможности'], ['Гранты', '/grants'], ['Профориентация', '/professions'], ['AI-чат', '/chat']] },
            { title: 'Компания', links: [['О нас', '#how'], ['Блог', '#'], ['Пресса', '#'], ['Контакты', '#']] },
            { title: 'Поддержка', links: [['Помощь', '#'], ['Конфиденциальность', '#'], ['Условия', '#'], ['Безопасность', '#']] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: C.font, fontSize: 12, fontWeight: 600, color: '#5A6485', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>{col.title}</div>
              {col.links.map(([label, href]) => (
                href.startsWith('/') ? (
                  <Link key={label} to={href} style={{ display: 'block', fontFamily: C.font, fontSize: 14, color: '#9AA3BF', marginBottom: 10, textDecoration: 'none' }}>
                    {label}
                  </Link>
                ) : (
                  <a key={label} href={href} style={{ display: 'block', fontFamily: C.font, fontSize: 14, color: '#9AA3BF', marginBottom: 10, textDecoration: 'none' }}>
                    {label}
                  </a>
                )
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #2A3457', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: C.font, fontSize: 13, color: '#5A6485' }}>© 2026 Talap.ai. Все права защищены.</div>
          <div style={{ fontFamily: C.font, fontSize: 13, color: '#5A6485' }}>Астана, Казахстан 🇰🇿</div>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div style={{ background: C.paper, overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}
