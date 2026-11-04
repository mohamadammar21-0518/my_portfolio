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

export default function ProjectVisual({ project, eager = false }: { project: PortfolioProject; eager?: boolean }) {
  if (project.image) return <img src={`/images/${project.image}`} alt={project.alt} loading={eager ? 'eager' : 'lazy'} />
  return <div className="project-type-cover" aria-hidden="true">
    <span className="cover-category">{project.category}</span>
    <strong>{project.displayName}</strong>
    <span className="cover-stack">{project.tags.slice(0, 3).join(' / ')}</span>
  </div>
}
