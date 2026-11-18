import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { profile, projects } from '../content'

function Arrow({ down = false }: { down?: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={down ? { transform: 'rotate(135deg)' } : undefined}><path d="M5 19 19 5M5 5h14v14" /></svg>
}

export default function EditorialHero() {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 65, damping: 25 })
  const sy = useSpring(y, { stiffness: 65, damping: 25 })
  return <div className="reference-hero neon-hero" onPointerMove={event => {
    if (reduced || event.pointerType !== 'mouse' || window.innerWidth <= 600) return
    const r = event.currentTarget.getBoundingClientRect()
    x.set(((event.clientX - r.left) / r.width - .5) * 12)
    y.set(((event.clientY - r.top) / r.height - .5) * 8)
  }} onPointerLeave={() => { x.set(0); y.set(0) }}>
    <motion.div className="reference-portrait" style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}>
      {!reduced && (
        <video className="hero-neon-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
          <source src="/images/hero-motion.mp4" type="video/mp4" />
        </video>
      )}
    </motion.div>
    <div className="reference-shade" />
    <div className="hero-meta">
      <p>Data Science Undergraduate<br /><span>Data Science · AI · Web &amp; Mobile</span></p>
    </div>
    <div className="hero-main">
      <motion.div initial={{ opacity: 0, y: reduced ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
        <p className="hero-availability"><span />Available for internships &amp; freelance projects</p>
        <h1 className="reference-title"><span>From data</span><span>to useful</span><span className="hero-outline">software.</span></h1>
        <p className="hero-summary">I turn data into predictions, automate workflows with AI, and build web and Android applications.</p>
        <a className="hero-work-link" href="#works">View selected work <Arrow /></a>
      </motion.div>
    </div>
    <div className="hero-bottom">
      <a href="#works" className="hero-project-count"><strong>{String(projects.length).padStart(2, '0')}</strong><span>Selected projects</span><Arrow /></a>
      <a href="#introduction" className="neon-scroll-link">Scroll to explore <Arrow down /></a>
      <div className="hero-socials"><a href={profile.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a></div>
    </div>
  </div>
}



