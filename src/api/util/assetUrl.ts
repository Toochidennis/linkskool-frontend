import { apiConfig } from '@/api/config'

const stripLeadingSlashes = (value: string) => value.replace(/^\/+/, '')

export const resolveAssetUrl = (imageUrl?: string | null): string | null => {
  const rawValue = imageUrl?.trim()
  if (!rawValue) {
    return null
  }

  if (rawValue.startsWith('https://') || rawValue.startsWith('http://')) {
    return rawValue
  }

  const baseUrl = apiConfig.imageBaseUrl?.trim()
  if (!baseUrl) {
    return rawValue
  }

  return `${baseUrl}/${stripLeadingSlashes(rawValue)}`
}
