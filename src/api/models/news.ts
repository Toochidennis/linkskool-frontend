export interface NewsImage {
  fileName: string
  oldFileName: string
  type: string
  file: string
  url: string
}

export interface NewsShare {
  url: string
  title: string
  pageTitle: string
  description: string
  image: string
  type: string
  card: string
  siteName: string
}

export interface ApiNewsItem {
  id: number
  title: string
  content: string
  authorName: string
  authorId: number
  status: string
  recommended: number
  datePosted: string
  images: NewsImage[]
  createdAt: string
  updatedAt: string
  deadline: string | null
  notifiedAt: string | null
  notifiedBy: number | null
  slug: string
  categories?: NewsCategory[]
  readTime: number
  share: NewsShare
}

export interface NewsCategory {
  id: number
  name: string
  createdAt: string
}

export interface ApiRelatedNewsItem {
  id: number
  slug: string
  title: string
  images: NewsImage[]
  datePosted: string
  authorName: string
}

export interface NewsDetailPayload {
  news: ApiNewsItem
  more: ApiRelatedNewsItem[]
}

export interface NewsListMeta {
  total: number
  limit: number
  currentPage: number
  lastPage: number
  hasNext: boolean
  hasPrev: boolean
}

export interface NewsListPayload {
  data: {
    categories: Record<string, number[]>
    news: ApiNewsItem[]
  }
  meta: NewsListMeta
}

export interface GetNewsOptions {
  page?: number
  limit?: number
  signal?: AbortSignal
}
