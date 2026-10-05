import ProjectCaption from './ProjectCaption'
import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Arrow } from './Primitives'
import { projects } from '../content'
import ProjectVisual, { projectVisualCaption } from './ProjectVisual'

export type PortfolioProject = typeof projects[number]

type Props = {
  project: PortfolioProject | null
  onClose: () => void
  onSelect: (project: PortfolioProject) => void
}

export default function ProjectDetail({ project, onClose, onSelect }: Props) {
  const reduced = useReducedMotion()
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const isOpen = Boolean(project)

  useEffect(() => {
    const element = dialog.current
    if (!element || !isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    closeButton.current?.focus({ preventScroll: true })
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (project) {
      dialog.current?.scrollTo({ top: 0, behavior: 'instant' })
      closeButton.current?.focus({ preventScroll: true })
    }
  }, [project])

  const otherProjects = project ? projects.filter(p => p.slug !== project.slug).slice(0, 3) : []

  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="project-detail-title"
      onCancel={event => { event.preventDefault(); onClose() }}
    >
      {project && (
        <motion.div className="detail-page" key={project.slug} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, ease: [.22, 1, .36, 1] }}>
          <button ref={closeButton} className="detail-close" onClick={onClose} aria-label="Close project">
            <span aria-hidden="true">×</span>
          </button>

          {/* Hero image */}
          <div className={`detail-hero ${project.slug}`}>
            <ProjectVisual project={project} eager />
          </div>

          {/* Content sheet */}
          <div className="detail-sheet">
            <header className="detail-heading">
              <h2 id="project-detail-title">{project.name}</h2>
              <span>Project {String(projects.indexOf(project) + 1).padStart(2, '0')} / {projects.length}</span>
            </header>

            <div className="case-summary">
              <div><span>Stage</span><strong>{project.status}</strong><small>{project.date}</small></div>
              <div><span>Technical focus</span><strong>{project.focus}</strong></div>
            </div>
            <div className="case-study">
              {[
                ['01', 'Problem', project.problem],
                ['02', 'My contribution', project.contribution],
                ['03', 'Result & progress', project.outcome],
                ['04', 'Technical approach', project.overview],
              ].map(([number, title, text]) => <section className="case-section" key={title}>
                <h3><span>{number}</span>{title}</h3><p>{text}</p>
              </section>)}
              <section className="case-section">
                <h3><span>05</span>Technology stack</h3>
                <div className="case-stack">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              </section>
              <section className="case-section case-evidence">
                <h3><span>06</span>Project evidence</h3>
                <div>
                  {!project.repoUrl && <p className="detail-evidence-note">{project.slug === 'aquasense' ? 'Explore the team’s Hult Prize recognition certificate.' : 'This project is in development. Public code and a live demo are not yet available.'}</p>}
                  <div className="detail-links">
                    {project.slug === 'aquasense' && <a className="button" href="/images/hult-prize-certificate.jpg" target="_blank" rel="noreferrer">Hult Prize certificate <Arrow /></a>}
                    {project.liveUrl && <a className="button" href={project.liveUrl} target="_blank" rel="noreferrer">Live application <Arrow /></a>}
                    {project.repoUrl && <a className="plain-link" href={project.repoUrl} target="_blank" rel="noreferrer">Source code <Arrow /></a>}
                  </div>
                </div>
              </section>
            </div>

            {/* Artwork */}
            {project.image && <figure className={`detail-artwork ${project.slug}`}>
              <img
                src={`/images/${project.image}`}
                alt={`${project.name} project artwork`}
                loading="lazy"
              />
              <figcaption>{project.name} · {projectVisualCaption(project)} · {project.tags.join(' / ')}</figcaption>
            </figure>}

            {project.gallery.length > 0 && <section className="project-gallery" aria-labelledby="project-gallery-title">
              <h3 id="project-gallery-title">Project screenshots</h3>
              <div className="project-gallery-grid">
                {project.gallery.map(item => <figure className="project-gallery-item" key={item.image}>
                  <img src={`/images/project-gallery/${item.image}`} alt={item.alt} loading="lazy" />
                  <figcaption>{item.caption}</figcaption>
                </figure>)}
              </div>
            </section>}

            {/* Related portfolio projects */}
            <section className="more-works" aria-labelledby="more-works-title">
              <h3 id="more-works-title">More works</h3>
              <div className="project-grid">
                {otherProjects.map(item => (
                  <button
                    className={`project-card ${item.slug}`}
                    key={item.slug}
                    onClick={() => onSelect(item)}
                    aria-label={`Explore ${item.name}`}
                  >
                    <ProjectVisual project={item} />
                    <ProjectCaption project={item} />
                  </button>
                ))}
              </div>
            </section>

            <button className="back-to-work" onClick={onClose}>← Back to all work</button>
          </div>
        </motion.div>
      )}
    </dialog>
  )
}
