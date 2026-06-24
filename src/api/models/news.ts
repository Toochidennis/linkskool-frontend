export interface NewsImage {
  fileName: string
  oldFileName: string
  type: string
  file: string
  url: string
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
  readTime: number
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
