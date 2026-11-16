import { useEffect, useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

/** Pointer-reactive orange/white grain field — mood colors from the referenced reel. */
export default function InteractiveTexture() {
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(50)
  const my = useMotionValue(40)
  const sx = useSpring(mx, { stiffness: 90, damping: 22, mass: .6 })
  const sy = useSpring(my, { stiffness: 90, damping: 22, mass: .6 })
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}% ${sy}%, #ff8a3acc 0%, #ff6a1a55 22%, transparent 58%)`
  const warm = useMotionTemplate`radial-gradient(420px circle at calc(${sx}% + 12%) calc(${sy}% - 8%), #fff6ecf0 0%, #ffe0c266 28%, transparent 62%)`
  const cool = useMotionTemplate`radial-gradient(380px circle at calc(${sx}% - 18%) calc(${sy}% + 16%), #ffb34755 0%, transparent 55%)`

  useEffect(() => {
    if (reduced) return
    const element = root.current
    if (!element) return
    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      mx.set(((event.clientX - rect.left) / rect.width) * 100)
      my.set(((event.clientY - rect.top) / rect.height) * 100)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my, reduced])

  return (
    <div ref={root} className="interactive-texture" aria-hidden="true">
      <div className="texture-base" />
      <motion.div className="texture-blob texture-blob-spot" style={{ background: spotlight }} />
      <motion.div className="texture-blob texture-blob-warm" style={{ background: warm }} />
      <motion.div className="texture-blob texture-blob-cool" style={{ background: cool }} />
      <span className="texture-orb texture-orb-a" />
      <span className="texture-orb texture-orb-b" />
      <span className="texture-orb texture-orb-c" />
      <div className="texture-grain" />
    </div>
  )
}
