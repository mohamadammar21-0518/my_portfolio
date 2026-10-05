import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={`motion-reveal ${className}`} initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }} transition={{ duration: .4, delay: reduced ? 0 : Math.min(delay / 1000, .18), ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}
export function Arrow() {
  return <svg aria-hidden="true" className="arrow" viewBox="0 0 20 20" fill="none">
    <path d="M5 15 15 5M6 5h9v9" />
  </svg>
}
export function ChevronRight() {
  return <svg aria-hidden="true" className="chevron-right" viewBox="0 0 20 20" fill="none">
    <path d="m7 4 6 6-6 6" />
  </svg>
}
export function ArrowDown() {
  return <svg aria-hidden="true" className="arrow-down" viewBox="0 0 20 20" fill="none">
    <path d="M10 3v13m-5-5 5 5 5-5" />
  </svg>
}
export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <p className="section-label"><span>{number}</span>{children}</p>
}

export function SectionDecoration({ variant }: { variant: 'work' | 'about' | 'journey' | 'contact' }) {
  return <div className={`section-decoration decoration-${variant}`} aria-hidden="true">
    <span className="decoration-halo" />
    <svg className="decoration-lines" viewBox="0 0 240 180" fill="none">
      <path d="M-10 150C45 160 60 25 120 50S175 130 250 10" />
      <path d="M-10 174C55 184 75 55 130 75S185 151 260 36" />
      <circle cx="120" cy="50" r="4" />
    </svg>
    <span className="decoration-star">✧</span>
  </div>
}
