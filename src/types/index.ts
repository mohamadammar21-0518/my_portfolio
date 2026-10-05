export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  image?: string
  link?: string
  size: 'large' | 'small'
}

export interface ProcessStep {
  number: string
  title: string
  description: string
}
