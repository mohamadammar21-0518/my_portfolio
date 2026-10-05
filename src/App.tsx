import ProjectCaption from './components/ProjectCaption'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Arrow, ArrowDown, ChevronRight, Reveal, SectionDecoration } from './components/Primitives'
import ProjectDetail, { type PortfolioProject } from './components/ProjectDetail'
import ProjectVisual from './components/ProjectVisual'
import { capabilities, credentials, education, experience, profile, projects, questions } from './content'

const navigation = [['Work', 'works'], ['About', 'about'], ['Journey', 'journey'], ['Contact', 'contact']]
function projectFromHash() {
  return projects.find(project => window.location.hash === `#project/${project.slug}`) ?? null
}

export default function App() {
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const readingProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 30 })
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
      <section id="home" className="hero" ref={hero}>
        <div className="hero-portrait">
          <img src="/images/portrait.jpeg" alt="Mohamad Ammar" width="719" height="1080" />
        </div>
        <div className="hero-fade" />
        <div className="hero-backdrop" aria-hidden="true">
          <span className="hero-orbit" />
          <svg className="hero-line-art" viewBox="0 0 360 260" fill="none">
            <path d="M-25 190C45 230 65 55 150 85S260 205 385 30" />
            <path className="line-art-secondary" d="M-30 220C55 255 85 92 155 112S265 225 380 70" />
            <circle cx="150" cy="85" r="5" /><circle cx="261" cy="138" r="3" />
          </svg>
          <span className="hero-spark hero-spark-one">✦</span>
          <span className="hero-spark hero-spark-two">✧</span>
          <svg className="hero-node-art" viewBox="0 0 140 100" fill="none">
            <path d="M15 75L60 25L120 65M60 25L70 85L120 65" />
            <circle cx="15" cy="75" r="4" /><circle cx="60" cy="25" r="5" /><circle cx="120" cy="65" r="4" /><circle cx="70" cy="85" r="3" />
          </svg>
        </div>
        <div className="hero-title">
          <p className="availability"><span />Open to internships &amp; freelance projects</p>
          <h1>Applied AI. <br />Built for real use.</h1>
          <p className="hero-role">Data Science Undergraduate · AI Engineering</p>
        </div>
        <div className="hero-intro">
          <p>I’m a Data Science undergraduate at AIU focused on Applied AI. I build practical applications with language models, retrieval, voice AI, and machine learning, with an emphasis on clear results and human oversight.</p>
          <div className="hero-links">
            <a className="button" href={profile.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <Arrow /></a>
            <a className="button button-cv" href="/documents/mohamad-ammar-cv.pdf" download="Mohamad-Ammar-CV.pdf">Download CV <ArrowDown /></a>
          </div>
        </div>
        <a className="hero-scroll" href="#works" aria-label="Explore featured works"><ArrowDown /></a>
      </section>

      {/* ── Works ───────────────────────────────────────────────────── */}
      <section id="works" className="section works">
        <SectionDecoration variant="work" />
        <Reveal className="works-heading">
          <h2><span className="section-number">01 /</span> Selected projects</h2>
          <p className="works-count">{projects.length} projects · AI systems, applications &amp; connected technology</p>
        </Reveal>

        <div className="project-filters" role="group" aria-label="Filter projects by category">
          {['All projects', ...Array.from(new Set(projects.map(item => item.category)))].map(category => (
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
            <motion.a
              key={item.slug}
              className={`project-card ${item.slug}`}
              layout="position"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .08 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : .98 }}
              whileHover={reducedMotion ? undefined : { y: -2 }}
              whileTap={reducedMotion ? undefined : { scale: .99 }}
              transition={{ duration: .4, ease: [.22, 1, .36, 1], layout: { type: 'spring', stiffness: 240, damping: 30 } }}
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
          ))}
          </AnimatePresence>
        </motion.div>

        <Reveal className="recognition-heading"><h2>Recognition &amp; inspiration</h2><p>Milestones, motivation, and the experience behind my work.</p></Reveal>
        {/* Highlights row */}
        <div className="highlights">
          <Reveal>
            <article className="highlight recognition">
              <div className="highlight-mark" aria-hidden="true"><span>✳</span></div>
              <h3>Hult Prize National Finalist</h3>
              <p>Recognised with Team AquaSense at the Hult Prize AIU 2025/26 Inter-University Competition.</p>
              <div className="recognition-summary"><strong>AquaSense</strong><span>AI-assisted water analysis · Software Lead</span></div>
              <a className="recognition-certificate" href="/images/hult-prize-certificate.jpg" target="_blank" rel="noreferrer" aria-label="View full-size Hult Prize 2026 Malaysia National Competition certificate">
                <img src="/images/hult-prize-certificate.jpg" alt="Certificate recognising Mohamad Ammar Mohamad Hassan as a member of a competing startup at the Hult Prize 2026 Malaysia National Competition" loading="lazy" width="3516" height="2479" />
                <span>Hult Prize 2026 · Malaysia National Competition <Arrow /></span>
              </a>
            </article>
          </Reveal>
          <Reveal delay={100}>
            <article className="highlight philosophy">
              <span className="quote-mark" aria-hidden="true">"</span>
              <p>“We can only see a short distance ahead, but we can see plenty there that needs to be done.”</p>
              <div className="quote-person">
                <span className="quote-initials" aria-hidden="true">AT</span>
                <div>Alan Turing<span>Computing Machinery and Intelligence · 1950</span></div>
              </div>
              <a className="quote-source" href="https://turingarchive.kings.cam.ac.uk/" target="_blank" rel="noreferrer">Read the source <Arrow /></a>
            </article>
          </Reveal>
          <Reveal delay={180}>
            <article className="highlight snapshot">
              <h3>Always learning.<br />Always building.</h3>
              <div className="stat-pill"><span><strong>3.76</strong> academic CGPA</span><span aria-hidden="true">✦</span></div>
              <div className="stat-pill"><span>AI, data &amp; full-stack projects</span><span aria-hidden="true">✦</span></div>
              <div className="stat-pill"><span>Mentored 66 student teams</span><span aria-hidden="true">✦</span></div>
              <a href="#contact">Let's connect <Arrow /></a>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ── About / Skills ──────────────────────────────────────────── */}
      <section id="about" className="section about">
        <SectionDecoration variant="about" />
        <Reveal className="split-heading">
          <p className="section-label">Technical skills</p>
          <h2>AI engineering, from retrieval and models to applications people can use. <span>Voice systems, multi-agent orchestration, explainable ML, and the software foundations that support them.</span></h2>
        </Reveal>
        <div className="services">
          {capabilities.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(`Let's talk about ${item.title}`)}`}
                className={`service-card service-${i}`}
              >
                <div className="service-title"><h3>{item.title}</h3><span aria-hidden="true">{item.glyph === '↗'
                  ? <svg className="service-code-icon" viewBox="0 0 24 24" fill="none"><path d="m8 6-6 6 6 6m8-12 6 6-6 6" /></svg>
                  : item.glyph}</span></div>
                <div className="service-cta" aria-hidden="true">Let's build something <Arrow /></div>
                <p>{item.description}</p>
                <div className="service-images" aria-hidden="true">
                  {item.images.map((image, index) => (
                    <img key={image} src={`/images/${image}`} alt="" loading="lazy" style={{ '--image-index': index } as React.CSSProperties} />
                  ))}
                </div>
                <div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}<span>+more</span></div>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal className="about-profile">
          <div className="about-profile-identity">
            <span className="about-profile-label">A little about me</span>
            <div className="about-profile-photo"><img src="/images/portrait.jpeg" alt="Mohamad Ammar" loading="lazy" width="719" height="1080" /></div>
            <h3>Mohamad Ammar<span>Mohamad Hassan</span></h3>
            <p>Data Science undergraduate<br />AIU · Malaysia</p>
            <span className="about-profile-focus"><span aria-hidden="true">✦</span> Applied AI &amp; AI Engineering</span>
          </div>
          <div className="about-profile-story">
            <span className="about-profile-label">My approach</span>
            <h3>Curiosity in the models.<br /><span>Purpose in the application.</span></h3>
            <p>My focus is Applied AI: building useful systems around language models, retrieval, voice, and machine learning. I enjoy connecting the model to the wider product — its data, architecture, interface, and the people using it.</p>
            <p>Through DocMind AI, LocalVoice CRM, and my student-success platform, I work on grounded answers, private AI workflows, and explainable predictions. Full-stack engineering and cloud deployment help me bring these ideas into practical applications, with clear results and human oversight.</p>
            <div className="about-profile-facts">
              <div><strong>3.76 <small>/ 4.00</small></strong><span>Current CGPA</span></div>
              <div><strong>2027</strong><span>Expected graduation</span></div>
              <div><strong>Applied AI</strong><span>Career focus</span></div>
            </div>
            <a className="about-profile-link" href={profile.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <Arrow /></a>
          </div>
        </Reveal>
      </section>

      {/* ── Education, leadership & experience ──────────────────────── */}
      <section id="journey" className="process section">
        <SectionDecoration variant="journey" />
        <Reveal className="split-heading">
          <p className="section-label">Education &amp; journey</p>
          <h2>Learning through data, product work, and community leadership. <span>My path combines a Data Science education with hands-on projects and mentoring young innovators.</span></h2>
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
                <article className="process-card journey-card">
                  <span className="journey-date">{item.date}</span>
                  <h4>{item.title}</h4>
                  <p className="journey-org">{item.organization}</p>
                  <p>{item.detail}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="credentials-grid">
          <article className="credential-card">
            <h3>Certifications &amp; training</h3>
            {[...credentials.certifications, ...credentials.training].map(item => <span key={item}>{item}</span>)}
          </article>
          <article className="credential-card">
            <h3>Campus &amp; community</h3>
            {credentials.activities.map(item => <span key={item}>{item}</span>)}
          </article>
          <article className="credential-card">
            <h3>Languages, interests &amp; strengths</h3>
            <p>{credentials.languages.join(' · ')}</p>
            <p>{credentials.interests.join(' · ')}</p>
            <p className="credential-strengths">{credentials.strengths.join(' · ')}</p>
          </article>
        </div>
      </section>

      {/* ── Contact / FAQ ────────────────────────────────────────────── */}
      <section id="contact" className="section contact">
        <SectionDecoration variant="contact" />
        <div className="faq-layout">
          <Reveal className="contact-intro">
            <p className="section-label">FAQs</p>
            <h2><span>Answers to common questions to help you understand</span> my work and how we can collaborate.</h2>
            <p className="contact-description">I’m looking for AI engineering and Applied AI internships, and I’m available for freelance AI and full-stack development projects. Get in touch to discuss a role or your project.</p>
            <a className="button" href={`mailto:${profile.email}`}>Discuss an opportunity <Arrow /></a>
            <div className="contact-direct-links"><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a><a href="/documents/mohamad-ammar-cv.pdf" download="Mohamad-Ammar-CV.pdf">Download CV <ArrowDown /></a></div>
            <button className="copy-email" onClick={copyEmail}>Copy email address</button>
            <p className="copy-status" role="status">{copyStatus}</p>
          </Reveal>
          <Reveal className="faq-panel">
            <span className="faq-badge">Internships & freelance enquiries</span>
            {questions.map(([question, answer], i) => (
              <div key={question} className={`faq ${openFaq === i ? 'expanded' : ''}`}>
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
              </div>
            ))}
          </Reveal>
        </div>
      </section>

    </main>

    {/* ── Footer ─────────────────────────────────────────────────── */}
    <footer>
      <a href="#home" className="wordmark">Applied AI Portfolio</a>
      <div className="footer-links">
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
        <a href={`mailto:${profile.email}`}>Email <Arrow /></a>
        <a href="#home">Back to top <ArrowDown /></a>
      </div>
      <p>© {new Date().getFullYear()} {profile.fullName}. AI Engineering · Data Science at AIU.</p>
    </footer>

    <ProjectDetail project={project} onClose={closeProject} onSelect={openProject} />
  </MotionConfig>
}




