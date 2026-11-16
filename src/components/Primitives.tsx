import { type PointerEvent as ReactPointerEvent, type ReactNode, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={`motion-reveal ${className}`}
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18, filter: reduced ? 'none' : 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: .12 }}
      transition={{ duration: .55, delay: reduced ? 0 : Math.min(delay / 1000, .28), ease: [.22, 1, .36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Magnetic({ children, className = '', strength = 14 }: { children: ReactNode; className?: string; strength?: number }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 20, mass: .4 })
  const sy = useSpring(y, { stiffness: 260, damping: 20, mass: .4 })

  function onMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    x.set((dx / rect.width) * strength)
    y.set((dy / rect.height) * strength)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`magnetic ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}

export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const sx = useSpring(rx, { stiffness: 220, damping: 24 })
  const sy = useSpring(ry, { stiffness: 220, damping: 24 })
  const shine = useTransform(sy, (rotateY) =>
    `linear-gradient(${105 + rotateY * 4}deg, transparent 35%, #ffffff22 48%, transparent 62%)`,
  )

  function onMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    ry.set((px - .5) * 10)
    rx.set((.5 - py) * 8)
  }

  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      <motion.span className="tilt-shine" style={{ background: shine }} aria-hidden="true" />
    </motion.div>
  )
}

export function Arrow() {
  return (
    <svg aria-hidden="true" className="arrow" viewBox="0 0 20 20" fill="none">
      <path d="M5 15 15 5M6 5h9v9" />
    </svg>
  )
}

export function ChevronRight() {
  return (
    <svg aria-hidden="true" className="chevron-right" viewBox="0 0 20 20" fill="none">
      <path d="m7 4 6 6-6 6" />
    </svg>
  )
}

export function ArrowDown() {
  return (
    <svg aria-hidden="true" className="arrow-down" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v13m-5-5 5 5 5-5" />
    </svg>
  )
}

export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <p className="section-label"><span>{number}</span>{children}</p>
}

export function SectionDecoration({ variant }: { variant: 'work' | 'about' | 'journey' | 'contact' }) {
  return (
    <div className={`section-decoration decoration-${variant}`} aria-hidden="true">
      <span className="decoration-halo" />
      <svg className="decoration-lines" viewBox="0 0 240 180" fill="none">
        <path d="M-10 150C45 160 60 25 120 50S175 130 250 10" />
        <path d="M-10 174C55 184 75 55 130 75S185 151 260 36" />
        <circle cx="120" cy="50" r="4" />
      </svg>
      <span className="decoration-star">✧</span>
      <div className="decoration-grain" />
    </div>
  )
}
