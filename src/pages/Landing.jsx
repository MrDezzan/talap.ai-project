import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Chip from '../components/Chip';
import { useLanguage } from '../context/LanguageContext';
import { useMobile } from '../hooks/useMobile';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';
import avatar3 from '../assets/avatar3.png';
import avatar4 from '../assets/avatar4.png';

const C = {
  ink900: '#0A1230', ink700: '#2A3457', ink500: '#5A6485', ink300: '#9AA3BF',
  blue: '#1448FF', blue50: '#F2F5FF', blue100: '#E6ECFF',
  paper: '#FFFFFF', mist: '#F5F7FB', mist2: '#ECEFF7', hairline: '#E4E8F1',
  success700: '#047857', success100: '#ECFAF3',
  font: 'var(--font-sans)',
};

function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div style={{ display: 'flex', gap: 4, background: C.mist, padding: 4, borderRadius: 8 }}>
      {['ru', 'en', 'kz'].map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: '4px 8px', borderRadius: 6, border: 'none',
            background: lang === l ? 'white' : 'transparent',
            color: lang === l ? C.blue : C.ink500,
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            cursor: 'pointer', boxShadow: lang === l ? '0 2px 4px rgba(10,18,48,0.05)' : 'none',
            transition: 'all 200ms'
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Navbar() {
  const { t } = useLanguage();
  const isMobile = useMobile();
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${C.hairline}`,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 16px' : '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontFamily: C.font, fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink900 }}>
            Talap<span style={{ color: C.blue }}>.</span>ai
          </span>
        </Link>

        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              { label: t('land_nav_features'), href: '#Возможности' },
              { label: t('land_nav_how'), href: '#how' },
              { label: t('land_nav_grants'), href: '/grants' },
            ].map(item => (
              item.href.startsWith('/') ? (
                <Link key={item.label} to={item.href} style={{
                  fontFamily: C.font, fontSize: 14, fontWeight: 500, color: C.ink700,
                  padding: '6px 12px', borderRadius: 6, textDecoration: 'none',
                  transition: 'color 150ms',
                }}>{item.label}</Link>
              ) : (
                <a key={item.label} href={item.href} style={{
                  fontFamily: C.font, fontSize: 14, fontWeight: 500, color: C.ink700,
                  padding: '6px 12px', borderRadius: 6, textDecoration: 'none',
                  transition: 'color 150ms',
                }}>{item.label}</a>
              )
            ))}
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16 }}>
          <LanguageSwitcher />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!isMobile && (
              <Link to="/login">
                <Button variant="ghost" size="sm" style={{ color: C.ink700 }}>{t('land_nav_login')}</Button>
              </Link>
            )}
            <Link to="/register">
              <Button variant="primary" size="sm">{t('land_nav_start')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const isMobile = useMobile();
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <section style={{ padding: isMobile ? '48px 16px' : '96px 40px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[avatar1, avatar2, avatar3, avatar4].map((av, i) => (
                  <div key={i} style={{ 
                    width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, borderRadius: 9999, border: '2px solid white', 
                    marginLeft: i === 0 ? 0 : -12, overflow: 'hidden', background: '#F5F7FB',
                    boxShadow: '0 4px 12px rgba(10,18,48,0.1)'
                  }}>
                    <img src={av} alt="user" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                  {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={12} color="#F2C572" style={{ fill: '#F2C572' }} />)}
                </div>
                <div style={{ fontFamily: C.font, fontSize: isMobile ? 11 : 13, fontWeight: 600, color: C.ink700 }}>
                  {t('land_social_rating')}
                </div>
              </div>
            </div>
            <h1 style={{ 
              fontFamily: C.font, 
              fontSize: isMobile ? 36 : 56, 
              lineHeight: isMobile ? '42px' : '60px', 
              fontWeight: 800, 
              letterSpacing: '-0.035em', 
              color: C.ink900, 
              margin: '0 0 24px' 
            }}>
              {t('land_hero_title1')}<br />
              <span style={{ color: C.blue }}>{t('land_hero_title2')}</span>
            </h1>
            <p style={{ fontFamily: C.font, fontSize: isMobile ? 16 : 18, lineHeight: isMobile ? '24px' : '28px', color: C.ink700, margin: '0 0 40px', maxWidth: 480 }}>
              {t('land_hero_desc')}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register" style={{ flex: isMobile ? 1 : 'initial' }}>
                <Button variant="primary" size="lg" icon="arrowRight" fullWidth={isMobile}>{t('land_hero_btn_start')}</Button>
              </Link>
              <a href="#how" style={{ flex: isMobile ? 1 : 'initial' }}>
                <Button variant="outline" size="lg" fullWidth={isMobile}>{t('land_hero_btn_how')}</Button>
              </a>
            </div>
            <div style={{ display: 'flex', gap: isMobile ? 16 : 24, marginTop: 40 }}>
              {[
                { value: '50 000+', label: t('land_hero_stats_students') },
                { value: '1 200+', label: t('land_hero_stats_grants') },
                { value: '95%', label: t('land_hero_stats_success') },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: C.font, fontSize: isMobile ? 20 : 24, fontWeight: 800, letterSpacing: '-0.025em', color: C.ink900 }}>{s.value}</div>
                  <div style={{ fontFamily: C.font, fontSize: isMobile ? 11 : 13, color: C.ink500, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -24, borderRadius: 32,
              background: 'radial-gradient(60% 60% at 50% 50%, rgba(20,72,255,0.08), transparent)',
            }} />
            <div style={{
              borderRadius: 20, padding: isMobile ? 20 : 24,
              background: 'white',
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
                    {lang === 'en' ? 'Online' : lang === 'kz' ? 'Желіде' : 'На связи'}
                  </div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <div style={{ fontFamily: C.font, fontSize: 14, color: C.ink900, lineHeight: 1.5 }}>
                  {lang === 'en' ? 'Based on your results (UNT 132, profile: math) I picked 3 directions:' : 
                   lang === 'kz' ? 'Сенің нәтижелерің негізінде (ҰБТ 132, профиль: математика) 3 бағыт таңдадым:' :
                   'На основе твоих результатов (ЕНТ 132, профиль: математика) подобрал 3 направления:'}
                </div>
                {[
                  { name: 'Data-аналитик', m: 92 },
                  { name: 'AI Engineer', m: 87 },
                  { name: 'Product-менеджер', m: 74 },
                ].map(p => (
                  <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12, marginTop: 10 }}>
                    <span style={{ fontFamily: C.font, fontSize: 13, fontWeight: 600, color: C.ink900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: isMobile ? 60 : 80, height: 4, background: C.mist2, borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ width: `${p.m}%`, height: '100%', background: C.blue, borderRadius: 9999 }} />
                      </div>
                      <span style={{ fontFamily: '"Geist Mono",monospace', fontSize: 11, fontWeight: 600, color: C.blue, width: 32 }}>{p.m}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Chip onClick={() => navigate('/grants')}>{t('nav_grants')}</Chip>
                <Chip onClick={() => navigate('/roadmap')}>{t('cat_modal_build_path')}</Chip>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Features() {
  const { t, lang } = useLanguage();
  const isMobile = useMobile();
  const features = [
    {
      icon: 'compass',
      title: lang === 'en' ? 'Proforientation' : lang === 'kz' ? 'Мамандық таңдау' : 'Профориентация',
      desc: lang === 'en' ? 'Take a 24-question test — get a list of professions with match percentages.' : 
            lang === 'kz' ? '24 сұрақтан тұратын тест тапсырып, мамандықтар тізімін алыңыз.' :
            'Пройди тест из 24 вопросов — получи список профессий с процентом совпадения с твоим профилем.',
      color: C.blue, bg: C.blue100,
    },
    {
      icon: 'award',
      title: t('nav_grants'),
      desc: lang === 'en' ? '1,200+ current grants in Kazakhstan and abroad. AI picks based on your grades.' :
            lang === 'kz' ? 'Қазақстандағы және шетелдегі 1 200-ден астам гранттар. AI сенің бағаларыңа қарай таңдайды.' :
            '1 200+ актуальных грантов в Казахстане и за рубежом. AI подбирает по твоим оценкам и направлению.',
      color: '#047857', bg: '#ECFAF3',
    },
    {
      icon: 'target',
      title: t('nav_roadmap'),
      desc: lang === 'en' ? 'Step-by-step roadmap from school to the first job. With specific courses and deadlines.' :
            lang === 'kz' ? 'Мектептен алғашқы жұмысқа дейінгі қадамдық жол картасы. Нақты курстар мен дедлайндармен.' :
            'Пошаговый roadmap от школы до первой работы. С конкретными курсами, дедлайнами и чекпоинтами.',
      color: '#6366F1', bg: '#EEF0FF',
    },
    {
      icon: 'trophy',
      title: t('nav_portfolio'),
      desc: lang === 'en' ? 'Collect Olympiads, courses, and hackathons in one place. Export for grant applications.' :
            lang === 'kz' ? 'Олимпиадаларды, курстарды, хакатондарды бір жерге жинаңыз. Грантқа өтінім үшін экспорттаңыз.' :
            'Собери олимпиады, курсы, хакатоны в одном месте. Экспортируй для заявки на грант одним кликом.',
      color: '#8A5A0E', bg: '#FFF6E5',
    },
    {
      icon: 'sparkles',
      title: t('chat_title'),
      desc: lang === 'en' ? 'Ask anything about careers, universities, or grants. Remembers your profile.' :
            lang === 'kz' ? 'Мансап, ЖОО немесе гранттар туралы кез келген нәрсені сұраңыз. Сенің профиліңді есте сақтайды.' :
            'Спроси что угодно о карьере, вузах или грантах. Отвечает на русском и казахском, помнит твой профиль.',
      color: C.blue, bg: C.blue50,
    },
    {
      icon: 'bell',
      title: lang === 'en' ? 'Deadlines & Reminders' : lang === 'kz' ? 'Дедлайндар мен еске салғыштар' : 'Дедлайнды и напоминания',
      desc: lang === 'en' ? 'Never miss a deadline. Smart notifications 30, 14, and 7 days before.' :
            lang === 'kz' ? 'Маңызды мерзімді ешқашан жіберіп алмаңыз. 30, 14 және 7 күн бұрын ақылды хабарламалар.' :
            'Никогда не пропустишь важный срок. Умные уведомления за 30, 14 и 7 дней до дедлайна.',
      color: '#B42318', bg: '#FDECEC',
    },
  ];

  return (
    <section id="Возможности" style={{ padding: isMobile ? '64px 16px' : '80px 40px', background: C.mist }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Chip>{t('land_nav_features')}</Chip>
          <h2 style={{ fontFamily: C.font, fontSize: isMobile ? 32 : 40, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink900, margin: '16px 0 16px' }}>
            {t('land_features_title')}
          </h2>
          <p style={{ fontFamily: C.font, fontSize: isMobile ? 15 : 17, color: C.ink700, maxWidth: 520, margin: '0 auto' }}>
            {t('land_features_desc')}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: C.paper, borderRadius: 16, padding: isMobile ? 24 : 28, border: `1px solid ${C.hairline}`, transition: 'transform 200ms, box-shadow 200ms' }}>
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

function HowItWorks() {
  const { t, lang } = useLanguage();
  const isMobile = useMobile();
  const steps = [
    { n: '01', title: lang === 'en' ? 'Tell about yourself' : lang === 'kz' ? 'Өзің туралы айт' : 'Расскажи о себе', desc: lang === 'en' ? 'Fill out your profile: grade, grades, interests.' : lang === 'kz' ? 'Профильді толтыр: сынып, бағалар, қызығушылықтар.' : 'Заполни профиль: класс, оценки, интересы.' },
    { n: '02', title: lang === 'en' ? 'Take the test' : lang === 'kz' ? 'Тест тапсыр' : 'Пройди тест', desc: lang === 'en' ? '24 questions and Talap AI picks professions.' : lang === 'kz' ? '24 сұрақ — Talap AI мамандық таңдайды.' : '24 вопроса — и Talap AI подберёт профессии.' },
    { n: '03', title: lang === 'en' ? 'Get a plan' : lang === 'kz' ? 'Жоспар ал' : 'Получи план', desc: lang === 'en' ? 'Personal roadmap with courses and grants.' : lang === 'kz' ? 'Курстар мен гранттары бар жол картасы.' : 'Персональный roadmap с курсами, грантами и дедлайнами.' },
    { n: '04', title: lang === 'en' ? 'Take action' : lang === 'kz' ? 'Әрекет ет' : 'Действуй', desc: lang === 'en' ? 'Apply, collect portfolio, ask AI.' : lang === 'kz' ? 'Өтінім бер, портфолио жина, AI-дан сұра.' : 'Подавай заявки, собирай портфолио, задавай вопросы AI.' },
  ];
  return (
    <section id="how" style={{ padding: isMobile ? '64px 16px' : '80px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Chip>{t('land_nav_how')}</Chip>
          <h2 style={{ fontFamily: C.font, fontSize: isMobile ? 32 : 40, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink900, margin: '16px 0 16px' }}>
            {lang === 'en' ? 'Four steps to your dream career' : lang === 'kz' ? 'Арман мансабына төрт қадам' : 'Четыре шага до карьеры мечты'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: isMobile ? 32 : 0, position: 'relative' }}>
          {!isMobile && <div style={{ position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 1, background: `linear-gradient(90deg, ${C.blue}, ${C.blue}66)` }} />}
          {steps.map((s, i) => (
            <div key={i} style={{ padding: isMobile ? 0 : '0 20px', textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 9999, background: i === 0 ? C.blue : 'white',
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

function Testimonials() {
  const { lang } = useLanguage();
  const isMobile = useMobile();
  const testimonials = [
    {
      text: lang === 'en' ? 'Thanks to Talap found Bolashak and entered UK master program.' : lang === 'kz' ? 'Talap арқасында Болашақ грантын тауып, Ұлыбританияға магистратураға түстім.' : 'Благодаря Talap нашла грант Болашак и поступила в магистратуру в Великобритании.',
      name: 'Айгерим Нурланова', role: 'Student, University of Edinburgh', tone: 'blue',
    },
    {
      text: lang === 'en' ? 'The test showed Data Science. Now intern at Kaspi.kz.' : lang === 'kz' ? 'Тест Data Science көрсетті. Қазір Kaspi.kz-те стажермын.' : 'Тест профориентации показал Data Science — сначала не верил. Сейчас стажёр в Kaspi.kz.',
      name: 'Даниял Сейткали', role: 'NU Student, Kaspi.kz Intern', tone: 'iris',
    },
    {
      text: lang === 'en' ? 'Career roadmap put everything in its place. Invaluable.' : lang === 'kz' ? 'Мансап жол картасы бәрін реттеді. Өте құнды.' : 'Карьерный roadmap разложил всё по полочкам. Я знал что сдавать, где учиться и как строить портфолио. Это бесценно.',
      name: 'Алибек Джаксыбеков', role: 'Developer at Chocofamily', tone: 'amber',
    },
  ];
  return (
    <section style={{ padding: isMobile ? '64px 16px' : '80px 40px', background: C.mist }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Chip tone="success" dot>{lang === 'en' ? 'Success Stories' : lang === 'kz' ? 'Жетістік тарихы' : 'Истории успеха'}</Chip>
          <h2 style={{ fontFamily: C.font, fontSize: isMobile ? 32 : 40, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink900, margin: '16px 0 0' }}>
            {lang === 'en' ? 'They already found their way' : lang === 'kz' ? 'Олар өз жолын тапты' : 'Они уже нашли свой путь'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 16, padding: isMobile ? 24 : 28, border: `1px solid ${C.hairline}` }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {[...Array(5)].map((_, j) => <Icon key={j} name="star" size={16} color="#F2C572" style={{ fill: '#F2C572' }} />)}
              </div>
              <p style={{ fontFamily: C.font, fontSize: 15, lineHeight: '24px', color: C.ink700, margin: '0 0 20px' }}>«{t.text}»</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 9999, background: C.blue50, color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.font, fontWeight: 700, fontSize: 16 }}>{t.name[0]}</div>
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
  const { t } = useLanguage();
  const isMobile = useMobile();
  return (
    <section style={{ padding: isMobile ? '48px 16px' : '80px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ borderRadius: 24, padding: isMobile ? '48px 24px' : '64px 80px', textAlign: 'center', background: C.blue50 }}>
          <h2 style={{ fontFamily: C.font, fontSize: isMobile ? 32 : 44, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink900, margin: '0 0 16px' }}>
            {t('land_cta_title')}
          </h2>
          <p style={{ fontFamily: C.font, fontSize: isMobile ? 15 : 17, color: C.ink700, margin: '0 0 36px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            {t('land_cta_desc')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
            <Link to="/register"><Button variant="primary" size="lg" icon="arrowRight" fullWidth={isMobile}>{t('land_cta_btn_profile')}</Button></Link>
            <Link to="/login"><Button variant="outline" size="lg" fullWidth={isMobile}>{t('land_cta_btn_login')}</Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { lang } = useLanguage();
  const isMobile = useMobile();
  return (
    <footer style={{ background: C.ink900, padding: isMobile ? '40px 16px' : '56px 40px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid #2A3457', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: 16 }}>
          <div style={{ fontFamily: C.font, fontSize: 13, color: '#5A6485' }}>© 2026 Talap.ai. {lang === 'en' ? 'All rights reserved.' : lang === 'kz' ? 'Барлық құқықтар қорғалған.' : 'Все права защищены.'}</div>
          <div style={{ fontFamily: C.font, fontSize: 13, color: '#5A6485' }}>{lang === 'en' ? 'Astana, Kazakhstan' : 'Астана, Казахстан'} 🇰🇿</div>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div style={{ background: '#FFFFFF', overflowX: 'hidden' }}>
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
