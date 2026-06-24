import type { ApiNewsItem, ApiRelatedNewsItem } from '@/api/models/news'
import type { NewsCard } from '@/data/news'

const defaultFallbackImage =
  'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80'

const fallbackImages = [
  defaultFallbackImage,
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
]

const accentByIndex: NewsCard['accent'][] = ['blue', 'orange', 'green', 'violet', 'rose']

const decodeText = (value: string) => {
  if (typeof document === 'undefined') {
    return value
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  }

  const textarea = document.createElement('textarea')
  textarea.innerHTML = value
  return textarea.value
}

const normalizeContent = (content: string) =>
  decodeText(content)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim()

const buildBody = (content: string) =>
  normalizeContent(content)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

const buildSummary = (content: string) => {
  const body = buildBody(content)
  const firstParagraph = body[0] ?? ''

  if (firstParagraph.length <= 180) {
    return firstParagraph
  }

  return `${firstParagraph.slice(0, 177).trimEnd()}...`
}

const resolveCategory = (item: ApiNewsItem, category?: string): NewsCard['category'] => {
  if (category) {
    return category
  }

  const title = `${item.title} ${item.content}`.toLowerCase()

  if (title.includes('scholarship') || title.includes('application') || title.includes('training')) {
    return 'Opportunities'
  }

  if (title.includes('linkskool')) {
    return 'Campus'
  }

  return 'Top Stories'
}

const resolveSize = (index: number): NewsCard['size'] => {
  const pattern: NewsCard['size'][] = [
    'horizontal',
    'square',
    'square',
    'square',
    'square',
    'square',
    'square',
    'square',
    'square',
    'horizontal',
  ]

  return pattern[index % pattern.length] ?? 'square'
}

export const mapApiNewsToCard = (item: ApiNewsItem, index: number, category?: string): NewsCard => {
  const images = item.images
    .map((image) => ({
      url: image.url,
      alt: decodeText(item.title),
    }))
    .filter((image) => Boolean(image.url))

  const imageUrl =
    images[0]?.url || fallbackImages[index % fallbackImages.length] || defaultFallbackImage

  return {
    id: item.id,
    slug: item.slug,
    title: decodeText(item.title),
    summary: buildSummary(item.content),
    body: buildBody(item.content),
    category: resolveCategory(item, category),
    source: item.authorName,
    publishedAt: item.datePosted,
    readTime: `${item.readTime} min read`,
    imageUrl,
    imageAlt: decodeText(item.title),
    images: images.length > 0 ? images : [{ url: imageUrl, alt: decodeText(item.title) }],
    size: resolveSize(index),
    accent: accentByIndex[index % accentByIndex.length] ?? 'blue',
  }
}

export const mapApiRelatedNewsToCard = (item: ApiRelatedNewsItem, index: number): NewsCard => {
  const imageUrl =
    item.images?.[0]?.url || fallbackImages[index % fallbackImages.length] || defaultFallbackImage
  const title = decodeText(item.title)

  return {
    id: item.id,
    slug: item.slug,
    title,
    summary: '',
    body: [],
    category: 'More',
    source: item.authorName,
    publishedAt: item.datePosted,
    readTime: '',
    imageUrl,
    imageAlt: title,
    images: item.images
      .map((image) => ({ url: image.url, alt: title }))
      .filter((image) => Boolean(image.url)),
    size: resolveSize(index),
    accent: accentByIndex[index % accentByIndex.length] ?? 'blue',
  }
}
