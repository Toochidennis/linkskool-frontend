export type NewsCategory = string

export interface NewsDisplayImage {
  url: string
  alt: string
}

export interface NewsCard {
  id: number
  slug: string
  title: string
  summary: string
  body: string[]
  contentHtml?: string
  category: NewsCategory
  source: string
  publishedAt: string
  readTime: string
  imageUrl: string
  imageAlt: string
  images?: NewsDisplayImage[]
  size: 'feature' | 'horizontal' | 'square'
  accent: 'blue' | 'orange' | 'green' | 'violet' | 'rose'
}
