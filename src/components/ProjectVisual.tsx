import type { PortfolioProject } from './ProjectDetail'

export function projectVisualCaption(project: PortfolioProject) {
  if (project.slug === 'adaptiveflow') return 'Traffic-camera reference frame used by the project'
  if (project.slug === 'ghosttrace') return 'Actual demo interface · Synthetic cases'
  if (project.slug === 'motorbike-rental-ai') return 'Actual local test console'
  if (project.slug === 'tdm-insight') return 'Application screenshot'
  if (project.slug === 'ai-employee-revenue-command-center') return 'Supervity AI logo'
  if (project.image.includes('-photo')) return 'Generated representative photograph'
  if (project.image.includes('-cover')) return 'Conceptual project illustration'
  return 'Original project asset'
}

const coverScreens: Record<string, string> = {
  'student-success-ai': 'student-success-dashboard-redacted.jpg',
  'docmind-ai': 'docmind-chat-upload.png',
  'tdm-insight': 'vancotrack-input-workflow.jpg',
  't20-world-cup-ai': 't20-super-eight-predictions.png',
}

export default function ProjectVisual({ project, eager = false }: { project: PortfolioProject; eager?: boolean }) {
  const screen = project.gallery.find(item => item.image === coverScreens[project.slug])
  const imagePath = screen ? `project-gallery/${screen.image}` : project.image
  const framed = screen || project.slug === 'motorbike-rental-ai'

  return <div className={`project-cover project-cover-${project.slug}${framed ? ' project-cover-framed' : ''}`}>
    <div className="project-cover-art">
      {imagePath
        ? <img src={`/images/${imagePath}`} alt={screen?.alt ?? project.alt} loading={eager ? 'eager' : 'lazy'} />
        : <div className="wordbuddy-tiles" aria-hidden="true">
            <span>W</span><span>O</span><span>R</span><span>D</span>
          </div>}
    </div>
    <div className="project-cover-label">
      <span>{project.category}</span>
      <strong>{project.displayName}</strong>
      <small>{project.tags.slice(0, 2).join(' / ')}</small>
    </div>
  </div>
}
