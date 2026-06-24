export const adsenseConfig = {
  clientId: (import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID as string | undefined)?.trim() ?? '',
  slots: {
    newsTop: (import.meta.env.VITE_GOOGLE_ADSENSE_NEWS_TOP_SLOT as string | undefined)?.trim() ?? '',
    newsInline: (import.meta.env.VITE_GOOGLE_ADSENSE_NEWS_INLINE_SLOT as string | undefined)?.trim() ?? '',
    newsBottom: (import.meta.env.VITE_GOOGLE_ADSENSE_NEWS_BOTTOM_SLOT as string | undefined)?.trim() ?? '',
    newsDetailHero: (import.meta.env.VITE_GOOGLE_ADSENSE_NEWS_DETAIL_HERO_SLOT as string | undefined)?.trim() ?? '',
    newsDetailTop: (import.meta.env.VITE_GOOGLE_ADSENSE_NEWS_DETAIL_TOP_SLOT as string | undefined)?.trim() ?? '',
    newsDetail: (import.meta.env.VITE_GOOGLE_ADSENSE_NEWS_DETAIL_SLOT as string | undefined)?.trim() ?? '',
    newsDetailBottom: (import.meta.env.VITE_GOOGLE_ADSENSE_NEWS_DETAIL_BOTTOM_SLOT as string | undefined)?.trim() ?? '',
  },
}

export const isAdsenseConfigured = Boolean(adsenseConfig.clientId)
