import type { PortfolioProject } from './ProjectDetail'
import { Arrow } from './Primitives'

export default function ProjectCaption({ project }: { project: PortfolioProject }) {
  const ongoing = project.status.includes('progress') || project.status.includes('In progress')
  return <>
    <span className={`project-badge ${ongoing ? 'is-ongoing' : project.liveUrl ? 'is-live' : 'is-selected'}`}>
      {ongoing ? 'In development' : project.liveUrl ? 'Live application' : project.slug === 'aquasense' ? 'Software Lead' : 'Selected project'}
    </span>
    <div className="project-caption">
      <h3>{project.displayName}</h3>
      <p className="project-proof">{project.highlight}</p>
      <div className="project-card-footer">
        <div className="tags">{project.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div>
        <span className="project-view">View project <Arrow /></span>
      </div>
    </div>
  </>
}
