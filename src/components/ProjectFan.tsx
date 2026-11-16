import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { projects } from '../content'
import type { PortfolioProject } from './ProjectDetail'
import { Arrow } from './Primitives'
export default function ProjectFan({ onSelect }: { onSelect: (project: PortfolioProject) => void }) {
 const [selected, setSelected] = useState(2)
 const reduced = useReducedMotion()
 const featured = ['ghosttrace', 'docmind-ai', 'adaptiveflow', 'motorbike-rental-ai', 'ai-employee-revenue-command-center'].map(slug => projects.find(p => p.slug === slug)!)
 return <section className="fan-section" aria-labelledby="fan-title">
 <div className="fan-heading"><div><p>PROJECT EXPLORER</p><h2 id="fan-title">Ideas into systems.</h2></div><span>Explore the work behind the skills.</span></div>
 <div className="fan-deck">{featured.map((project,index) => <motion.button type="button" key={project.slug} className="fan-card" aria-label={'Explore '+project.displayName} onMouseEnter={() => setSelected(index)} onFocus={() => setSelected(index)} onClick={() => onSelect(project)} animate={reduced ? {} : {rotate:(index-2)*9,y:selected===index?-28:Math.abs(index-2)*15,scale:selected===index?1.06:1}} style={{zIndex:selected===index?10:5-Math.abs(index-2)}} transition={{type:'spring',stiffness:200,damping:24}}>
 <img src={'/images/'+project.image} alt="" loading="lazy" /><span className="fan-card-label"><small>0{index+1} / {project.category}</small><strong>{project.displayName}</strong><Arrow /></span></motion.button>)}</div>
 <div className="fan-foot"><span>RESEARCH. BUILD. EVALUATE. REPEAT.</span><a href="#works">All {projects.length} projects <Arrow /></a></div></section>
}
