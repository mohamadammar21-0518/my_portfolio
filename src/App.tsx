import EditorialHero from './components/EditorialHero'
import ProjectCaption from './components/ProjectCaption'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Arrow, ArrowDown, ChevronRight, Magnetic, Reveal, SectionDecoration, TiltCard } from './components/Primitives'
import ProjectDetail, { type PortfolioProject } from './components/ProjectDetail'
import ProjectVisual from './components/ProjectVisual'
import { capabilities, credentials, education, experience, profile, projects, questions } from './content'

const heroFocus = [
  { label: 'RAG applications', text: 'Document answers with hybrid retrieval, reranking, and page-level citations.', slug: 'docmind-ai' },
  { label: 'AI automation', text: 'Multi-agent workflows with policy checks and human review before action.', slug: 'ai-employee-revenue-command-center' },
  { label: 'Web development', text: 'Kafe Eman pairs a responsive café website with customer ordering and branch administration.', slug: 'kafe-eman' },
  { label: 'Mobile development', text: 'VancoTrack is a native Android app with reviewed on-device OCR, input validation, and PDF export.', slug: 'tdm-insight' },
  { label: 'Machine learning', text: 'The T20 Predictor uses XGBoost to estimate match-win probabilities and Streamlit to explore tournament scenarios.', slug: 't20-world-cup-ai' },
]

const navigation = [['Work', 'works'], ['Design', 'design'], ['About', 'about'], ['Journey', 'journey'], ['Contact', 'contact']]
function projectFromHash() {
  return projects.find(project => window.location.hash === `#project/${project.slug}`) ?? null
}

export default function App() {
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const readingProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 30 })
  const [focusIndex, setFocusIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const [headerOverHero, setHeaderOverHero] = useState(true)
  const [active, setActive] = useState('home')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [project, setProject] = useState<PortfolioProject | null>(projectFromHash)
  const [projectCategory, setProjectCategory] = useState('All projects')
  const [copyStatus, setCopyStatus] = useState('')
  const menuButton = useRef<HTMLButtonElement>(null)
  const hero = useRef<HTMLElement>(null)
  const openedFromPage = useRef(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY)
    let frame = 0
    setHeaderHidden(false)
    const update = () => {
      frame = 0
      const currentY = Math.max(0, window.scrollY)
      setHeaderOverHero((hero.current?.getBoundingClientRect().bottom ?? 0) > 76)
      const difference = currentY - previousY
      if (menuOpen || currentY < 80) setHeaderHidden(false)
      else if (Math.abs(difference) >= 8) setHeaderHidden(difference > 0)
      if (Math.abs(difference) >= 8 || currentY < 80) previousY = currentY
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [menuOpen])

  useEffect(() => {
    const sync = () => setProject(projectFromHash())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const element = hero.current
      if (!element) return
      const progress = Math.min(1, Math.max(0, -element.getBoundingClientRect().top / (element.offsetHeight * .85)))
      element.style.setProperty('--hero-opacity', String(1 - progress))
      element.style.setProperty('--hero-shift', `${-18 * progress}px`)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const reached = Array.from(document.querySelectorAll<HTMLElement>('main section[id]')).filter(
        section => section.getBoundingClientRect().top < 180,
      )
      setActive(reached[reached.length - 1]?.id ?? 'home')
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [menuOpen])

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  function openProject(next: PortfolioProject) {
    if (project) {
      window.history.replaceState(null, '', `#project/${next.slug}`)
      setProject(next)
    } else {
      openedFromPage.current = true
      window.location.hash = `project/${next.slug}`
    }
  }
  function closeProject() {
    if (openedFromPage.current) { openedFromPage.current = false; window.history.back() }
    else window.location.hash = 'works'
  }
  async function copyEmail() {
    clearTimeout(copyTimer.current)
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyStatus('Email address copied.')
    } catch {
      setCopyStatus(`Copy this address: ${profile.email}`)
    }
    copyTimer.current = setTimeout(() => setCopyStatus(''), 6000)
  }

  return <MotionConfig reducedMotion="user">
    <motion.div className="reading-progress" style={{ scaleX: readingProgress }} aria-hidden="true" />
    <a className="skip-link" href="#main">Skip to content</a>

    {/* ── Header ─────────────────────────────────────────────────── */}
    <header className={`header${headerOverHero ? ' header-over-hero' : ''}${headerHidden ? ' header-hidden' : ''}`}  onFocusCapture={() => setHeaderHidden(false)}>
      <a className="wordmark" href="#home" onClick={() => setMenuOpen(false)}>Mohamad Ammar</a>
      <a className="header-email" href={`mailto:${profile.email}`}>{profile.email}</a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map(([name, id]) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{name}{active === id && <motion.span className="nav-indicator" layoutId="navigation-indicator" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}</a>
        ))}
      </nav>
      <button
        ref={menuButton}
        className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span /><span />
      </button>
      <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen}>
        {navigation.map(([name, id]) => (
          <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{name}<ChevronRight /></a>
        ))}
      </nav>
    </header>

    <main id="main">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section id="home" ref={hero}><EditorialHero /></section>
      <section id="introduction" className="reference-intro section">
        <div className="reference-label"><span>01</span><span>/introduction</span></div>
        <Reveal><h2 className="intro-statement">Mohamad Ammar.<br /><span>Data Science, AI &amp; Software Development.</span></h2></Reveal>
        <div className="intro-grid">
          <img src="/images/editorial-portrait.jpeg" alt="Mohamad Ammar" loading="lazy" className="intro-photo" />
          <div>
          <div className="editorial-bio"><p>I’m Mohamad Ammar, a Data Science undergraduate building AI tools, predictive models, and web and mobile applications. I’m open to internships and freelance projects where I can turn ideas into useful software.</p>
            <div className="hero-links"><a className="button" href="#works">Explore my work <Arrow /></a><a className="editorial-cv" href="/documents/mohamad-ammar-cv.pdf" download="Mohamad-Ammar-CV.pdf">Download CV <ArrowDown /></a><a className="editorial-cv" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a></div>
          </div>          <div className="hero-focus">
            <div className="hero-focus-options" role="group" aria-label="Explore my project focus areas">{heroFocus.map((item, index) => <button key={item.label} type="button" aria-pressed={focusIndex === index} onClick={() => setFocusIndex(index)}>{item.label}</button>)}</div>
            <div className="hero-focus-detail" aria-live="polite"><p>{heroFocus[focusIndex].text}</p><a href={`#project/${heroFocus[focusIndex].slug}`}>Explore project <Arrow /></a></div>
          </div>
          </div>
        </div>
      </section>

      {/* ── Works ───────────────────────────────────────────────────── */}
      <section id="works" className="section works">
        <SectionDecoration variant="work" />
        <Reveal className="works-heading">
          <h2><span className="section-number">02 /featured</span> Selected projects</h2>
          <p className="works-count">{projects.length} projects · AI, data, web &amp; mobile</p>
        </Reveal>

        <div className="project-filters" role="group" aria-label="Filter projects by category">
          {['All projects', 'Web & Mobile', 'AI & Automation', 'Data Science & ML'].map(category => (
            <motion.button
              key={category}
              type="button"
              className={projectCategory === category ? 'active' : ''}
              aria-pressed={projectCategory === category}
              onClick={() => setProjectCategory(category)}
              whileTap={reducedMotion ? undefined : { scale: .97 }}
            >{projectCategory === category && <motion.span className="filter-surface" layoutId="project-filter" transition={{ type: 'spring', stiffness: 340, damping: 32 }} />}{category === 'All projects' ? `${category} · ${projects.length}` : category}</motion.button>
          ))}
        </div>

        {/* Project grid — cards animate individually via stagger class */}
        <motion.div className="project-grid" layout>
          <AnimatePresence initial={false} mode="popLayout">
          {projects.filter(item => projectCategory === 'All projects' || item.category === projectCategory).map((item, i) => (
            <TiltCard key={item.slug} className={`project-tilt ${i < 3 && projectCategory === 'All projects' ? 'featured-project' : ''}`}>
              <motion.a
                className={`project-card ${item.slug}`}
                layout="position"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 16, scale: reducedMotion ? 1 : .985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: .08 }}
                exit={{ opacity: 0, scale: reducedMotion ? 1 : .97 }}
                whileHover={reducedMotion ? undefined : { y: -6 }}
                whileTap={reducedMotion ? undefined : { scale: .985 }}
                transition={{ duration: .45, ease: [.22, 1, .36, 1], layout: { type: 'spring', stiffness: 240, damping: 30 } }}
                href={`#project/${item.slug}`}
                onClick={event => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                  event.preventDefault()
                  openProject(item)
                }}
                aria-label={`Explore ${item.name}`}
              >
                <ProjectVisual project={item} eager={i < 2} />
                <ProjectCaption project={item} />
              </motion.a>
            </TiltCard>
          ))}
          </AnimatePresence>
        </motion.div>

        <Reveal className="recognition-heading"><h2>Recognition &amp; inspiration</h2><p>Milestones, motivation, and the experience behind my work.</p></Reveal>
        {/* Highlights row */}
        <div className="highlights">
          <Reveal>
            <motion.article className="highlight recognition" whileHover={reducedMotion ? undefined : { y: -6 }} transition={{ type: 'spring', stiffness: 320, damping: 24 }}>
              <div className="highlight-mark" aria-hidden="true"><span>✳</span></div>
              <h3>Hult Prize National Finalist</h3>
              <p>Recognised with Team AquaSense at the Hult Prize AIU 2025/26 Inter-University Competition.</p>
              <div className="recognition-summary"><strong>AquaSense</strong><span>AI-assisted water analysis · Software Lead</span></div>
              <a className="recognition-certificate" href="/images/hult-prize-certificate.jpg" target="_blank" rel="noreferrer" aria-label="View full-size Hult Prize 2026 Malaysia National Competition certificate">
                <img src="/images/hult-prize-certificate.jpg" alt="Certificate recognising Mohamad Ammar Mohamad Hassan as a member of a competing startup at the Hult Prize 2026 Malaysia National Competition" loading="lazy" width="3516" height="2479" />
                <span>Hult Prize 2026 · Malaysia National Competition <Arrow /></span>
              </a>
            </motion.article>
          </Reveal>
          <Reveal delay={100}>
            <motion.article className="highlight philosophy" whileHover={reducedMotion ? undefined : { y: -6 }} transition={{ type: 'spring', stiffness: 320, damping: 24 }}>
              <span className="quote-mark" aria-hidden="true">"</span>
              <p>“We can only see a short distance ahead, but we can see plenty there that needs to be done.”</p>
              <div className="quote-person">
                <span className="quote-initials" aria-hidden="true">AT</span>
                <div>Alan Turing<span>Computing Machinery and Intelligence · 1950</span></div>
              </div>
              <a className="quote-source" href="https://turingarchive.kings.cam.ac.uk/" target="_blank" rel="noreferrer">Read the source <Arrow /></a>
            </motion.article>
          </Reveal>
          <Reveal delay={180}>
            <motion.article className="highlight snapshot" whileHover={reducedMotion ? undefined : { y: -6 }} transition={{ type: 'spring', stiffness: 320, damping: 24 }}>
              <h3>Always learning.<br />Always building.</h3>
              <motion.div className="stat-pill" whileHover={reducedMotion ? undefined : { x: 4 }}><span><strong>3.80</strong> academic CGPA</span><span aria-hidden="true">✦</span></motion.div>
              <motion.div className="stat-pill" whileHover={reducedMotion ? undefined : { x: 4 }}><span>AI, data &amp; full-stack projects</span><span aria-hidden="true">✦</span></motion.div>
              <motion.div className="stat-pill" whileHover={reducedMotion ? undefined : { x: 4 }}><span>FoTLI 2026 Silver Award · WordBuddy</span><span aria-hidden="true">✦</span></motion.div>
              <a href="#contact">Let's connect <Arrow /></a>
            </motion.article>
          </Reveal>
        </div>
      </section>

      {/* Product design evidence from applications I built. */}
      <section id="design" className="design-section section" aria-labelledby="design-title">
        <Reveal className="design-heading">
          <div>
            <p className="section-label">Interface design / selected work</p>
            <h2 id="design-title">Built to be<br /><em>understood.</em></h2>
          </div>
          <p>My design approach starts with the decision a person needs to make. I shape the interface around clear states, useful feedback, and a path from complex systems to confident action.</p>
        </Reveal>
        <div className="design-gallery">
          <Reveal className="design-feature design-feature-wide">
            <a href="#project/docmind-ai" onClick={event => { event.preventDefault(); openProject(projects.find(item => item.slug === 'docmind-ai')!) }} aria-label="Explore DocMind AI project details">
              <div className="design-image design-image-docmind"><img src="/images/project-gallery/docmind-chat-upload.png" alt="DocMind AI document chat interface with clear upload and suggested question actions" loading="lazy" /></div>
              <div className="design-feature-copy"><span>01 / DOCUMENT INTELLIGENCE</span><h3>Make the next step obvious.</h3><p>DocMind AI brings document upload, suggested prompts, and source-grounded answers into one focused workspace.</p><span className="design-feature-link">View project <Arrow /></span></div>
            </a>
          </Reveal>
          <Reveal className="design-feature" delay={80}>
            <a href="#project/ai-employee-revenue-command-center" onClick={event => { event.preventDefault(); openProject(projects.find(item => item.slug === 'ai-employee-revenue-command-center')!) }} aria-label="Explore AI Employee project details">
              <div className="design-image design-image-employee"><img src="/images/project-gallery/ai-employee-operators.png" alt="AI Employee operator dashboard with distinct workflow cards and status labels" loading="lazy" /></div>
              <div className="design-feature-copy"><span>02 / WORKFLOW VISIBILITY</span><h3>Show what the system is doing.</h3><p>Operator cards and status labels make a multi-agent workflow easier to scan and review.</p><span className="design-feature-link">View project <Arrow /></span></div>
            </a>
          </Reveal>
          <Reveal className="design-feature" delay={140}>
            <a href="#project/tdm-insight" onClick={event => { event.preventDefault(); openProject(projects.find(item => item.slug === 'tdm-insight')!) }} aria-label="Explore VancoTrack project details">
              <div className="design-image design-image-vanco"><img src="/images/project-gallery/vancotrack-results-screen.jpg" alt="VancoTrack mobile results screen with grouped pharmacokinetic outputs and review notes" loading="lazy" /></div>
              <div className="design-feature-copy"><span>03 / MOBILE CLARITY</span><h3>Turn dense results into readable steps.</h3><p>VancoTrack groups calculations, explanations, and review notes so users can inspect each result.</p><span className="design-feature-link">View project <Arrow /></span></div>
            </a>
          </Reveal>
        </div>
        <div className="design-principles" aria-label="My interface design principles"><span>Clear hierarchy</span><span>Meaningful feedback</span><span>Accessible interaction</span><span>Human review</span></div>
      </section>

      {/* ── About / Skills ──────────────────────────────────────────── */}
      <section id="about" className="section about">
        <SectionDecoration variant="about" />
        <Reveal className="split-heading">
          <p className="section-label">Technical skills</p>
          <h2>Skills across AI, machine learning, and automation. <span>Data analysis, retrieval systems, computer vision, voice assistants, and the engineering needed to deploy them.</span></h2>
        </Reveal>
        <div className="services">
          {capabilities.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <motion.a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(`Let's talk about ${item.title}`)}`}
                className={`service-card service-${i}`}
                whileHover={reducedMotion ? undefined : { y: -10, scale: 1.01 }}
                whileTap={reducedMotion ? undefined : { scale: .985 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <div className="service-title"><h3>{item.title}</h3><span aria-hidden="true">{item.glyph === '↗'
                  ? <svg className="service-code-icon" viewBox="0 0 24 24" fill="none"><path d="m8 6-6 6 6 6m8-12 6 6-6 6" /></svg>
                  : item.glyph}</span></div>
                <div className="service-cta" aria-hidden="true">Let's build something <Arrow /></div>
                <p>{item.description}</p>
                <div className="service-images" aria-hidden="true">
                  {item.images.map((image, index) => (
                    <img key={`${image}-${index}`} src={`/images/${image}`} alt="" loading="lazy" style={{ '--image-index': index } as React.CSSProperties} />
                  ))}
                </div>
                <div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}<span>+more</span></div>
              </motion.a>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <motion.div className="about-profile" whileHover={reducedMotion ? undefined : { y: -4 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }}>
            <div className="about-profile-identity">
              <span className="about-profile-label">A little about me</span>
              <div className="about-profile-photo"><img src="/images/portrait.jpeg" alt="Mohamad Ammar" loading="lazy" width="719" height="1080" /></div>
              <h3>Mohamad Ammar<span>Mohamad Hassan</span></h3>
              <p>Data Science undergraduate<br />AIU · Malaysia</p>
              <span className="about-profile-focus"><span aria-hidden="true">✦</span> Data Science, AI &amp; Software</span>
            </div>
            <div className="about-profile-story">
              <span className="about-profile-label">My approach</span>
              <h3>From data and models<br /><span>to practical applications.</span></h3>
              <p>I study Data Science at Albukhary International University in Malaysia, with a CGPA of 3.80 / 4.00. I’m currently completing a virtual Generative AI internship with Codomax Digital Solutions and building practical AI applications.</p>
              <p>My projects range from predictive models and document Q&amp;A to voice-driven CRM tools and native Android applications. I focus on clear interfaces, careful validation, and human review where decisions need oversight.</p>
              <div className="about-profile-facts">
                <div><strong>3.80 <small>/ 4.00</small></strong><span>Current CGPA</span></div>
                <div><strong>Oct 2027</strong><span>Expected graduation</span></div>
                <div><strong>Data + Apps</strong><span>Models, APIs &amp; interfaces</span></div>
              </div>
              <Magnetic strength={10}><a className="about-profile-link" href={profile.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <Arrow /></a></Magnetic>
            </div>
          </motion.div>
        </Reveal>
      </section>

      {/* ── Education, leadership & experience ──────────────────────── */}
      <section id="journey" className="process section">
        <SectionDecoration variant="journey" />
        <Reveal className="split-heading">
          <p className="section-label">Education &amp; journey</p>
          <h2>Learning through data, product work, and community leadership. <span>My path combines Data Science studies, a Generative AI internship, hands-on projects, and mentoring young innovators.</span></h2>
        </Reveal>
        <div className="journey-layout">
          <div className="journey-education">
            <span className="process-flower" aria-hidden="true">✳</span>
            <h3>Education</h3>
            {education.map(item => (
              <article className="education-card" key={item.title}>
                <span className="journey-date">{item.date}</span>
                <h4>{item.title}</h4>
                <p className="journey-org">{item.institution}</p>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="journey-experience">
            <h3>Leadership &amp; experience</h3>
            {experience.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <motion.article
                  className="process-card journey-card"
                  whileHover={reducedMotion ? undefined : { y: -4, borderColor: '#999999' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <span className="journey-date">{item.date}</span>
                  <h4>{item.title}</h4>
                  <p className="journey-org">{item.organization}</p>
                  <p>{item.detail}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="credentials-grid">
          {[
            { title: 'Certifications & training', body: [...credentials.certifications, ...credentials.training].map(item => <span key={item}>{item}</span>) },
            { title: 'Campus & community', body: credentials.activities.map(item => <span key={item}>{item}</span>) },
            { title: 'Languages, interests & strengths', body: <>
              <p>{credentials.languages.join(' · ')}</p>
              <p>{credentials.interests.join(' · ')}</p>
              <p className="credential-strengths">{credentials.strengths.join(' · ')}</p>
            </> },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i * 80}>
              <motion.article className="credential-card" whileHover={reducedMotion ? undefined : { y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                <h3>{card.title}</h3>
                {card.body}
              </motion.article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Contact / FAQ ────────────────────────────────────────────── */}
      <section id="contact" className="section contact">
        <SectionDecoration variant="contact" />
        <div className="faq-layout">
          <Reveal className="contact-intro">
            <p className="section-label">Have an opportunity?</p>
            <h2>Let’s build<br /><span>something useful.</span></h2>
            <p className="contact-description">I’m seeking internships in AI engineering, data science, machine learning, web development, and mobile development. I’m also available for freelance applications and automation projects. Get in touch to discuss a role or your project.</p>
            <Magnetic><a className="button" href={`mailto:${profile.email}`}>Discuss an opportunity <Arrow /></a></Magnetic>
            <div className="contact-direct-links">
              <Magnetic strength={10}><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a></Magnetic>
              <Magnetic strength={10}><a href="/documents/mohamad-ammar-cv.pdf" download="Mohamad-Ammar-CV.pdf">Download CV <ArrowDown /></a></Magnetic>
            </div>
            <button className="copy-email" onClick={copyEmail}>Copy email address</button>
            <p className="copy-status" role="status">{copyStatus}</p>
          </Reveal>
          <Reveal className="faq-panel">
            <span className="faq-badge">Internships & freelance enquiries</span>
            {questions.map(([question, answer], i) => (
              <motion.div
                key={question}
                className={`faq ${openFaq === i ? 'expanded' : ''}`}
                layout
                whileHover={reducedMotion ? undefined : { y: -2 }}
                transition={{ layout: { type: 'spring', stiffness: 320, damping: 30 } }}
              >
                <h3>
                  <button
                    id={`question-${i}`}
                    aria-expanded={openFaq === i}
                    aria-controls={`answer-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {question}<span aria-hidden="true">+</span>
                  </button>
                </h3>
                <div
                  id={`answer-${i}`}
                  role="region"
                  aria-labelledby={`question-${i}`}
                  aria-hidden={openFaq !== i}
                  className="faq-answer"
                >
                  <div><p>{answer}</p></div>
                </div>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

    </main>

    {/* ── Footer ─────────────────────────────────────────────────── */}
    <footer className="reference-footer">
      <a href="#home" className="wordmark">AI &amp; ML Portfolio</a>
      <div className="footer-links">
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
        <a href={`mailto:${profile.email}`}>Email <Arrow /></a>
        <a href="#home">Back to top <ArrowDown /></a>
      </div>
      <p>© {new Date().getFullYear()} {profile.fullName}. Data Science, AI &amp; Software · Data Science at AIU.</p>
    </footer>

    <ProjectDetail project={project} onClose={closeProject} onSelect={openProject} />
  </MotionConfig>
}





