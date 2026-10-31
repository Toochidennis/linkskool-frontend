import { watch, onUnmounted } from 'vue'

interface PageMetaOptions {
    title: string
    description?: string
    keywords?: string
    image?: string
    url?: string
    type?: string
    /** The page's own address for search engines; defaults to `url`. */
    canonical?: string
    /** e.g. 'noindex, nofollow' for private pages; the site default otherwise. */
    robots?: string
    /** Structured data for the page, written as one JSON-LD script. */
    jsonLd?: Record<string, unknown> | null
}

const JSON_LD_ID = 'page-json-ld'

/**
 * Composable to dynamically update page meta tags for SEO and social media sharing
 * Updates document title, description, Open Graph, and Twitter Card tags
 */
export function usePageMeta(options: PageMetaOptions | (() => PageMetaOptions)) {
    const metaTags = new Map<string, HTMLMetaElement>()
    const originalTitle = document.title
    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const originalCanonical = canonicalLink?.getAttribute('href') ?? null
    const robotsTag = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const originalRobots = robotsTag?.getAttribute('content') ?? null

    const setCanonical = (href: string) => {
        let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
        if (!link) {
            link = document.createElement('link')
            link.setAttribute('rel', 'canonical')
            document.head.appendChild(link)
        }
        link.setAttribute('href', href)
    }

    const setJsonLd = (data: Record<string, unknown> | null | undefined) => {
        let script = document.getElementById(JSON_LD_ID)
        if (!data) {
            script?.remove()
            return
        }
        if (!script) {
            script = document.createElement('script')
            script.id = JSON_LD_ID
            script.setAttribute('type', 'application/ld+json')
            document.head.appendChild(script)
        }
        script.textContent = JSON.stringify(data)
    }

    /** Leaving the page puts back the site-wide defaults from index.html. */
    const restore = () => {
        document.title = originalTitle
        if (originalCanonical !== null) setCanonical(originalCanonical)
        if (originalRobots !== null) updateMeta('robots', originalRobots)
        setJsonLd(null)
    }

    const updateMeta = (name: string, content: string, property = false) => {
        const attr = property ? 'property' : 'name'
        let tag = metaTags.get(name)

        if (!tag) {
            // Try to find existing tag
            tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement

            if (!tag) {
                // Create new tag
                tag = document.createElement('meta')
                tag.setAttribute(attr, name)
                document.head.appendChild(tag)
            }

            metaTags.set(name, tag)
        }

        tag.setAttribute('content', content)
    }

    const applyMeta = () => {
        const meta = typeof options === 'function' ? options() : options

        // Update title
        document.title = meta.title

        // Without this every page keeps index.html's canonical: the homepage.
        const canonical = meta.canonical ?? meta.url
        if (canonical) {
            setCanonical(canonical)
        }

        updateMeta('robots', meta.robots ?? originalRobots ?? 'index, follow')
        setJsonLd(meta.jsonLd)

        // Update description
        if (meta.description) {
            updateMeta('description', meta.description)
        }

        // Update keywords
        if (meta.keywords) {
            updateMeta('keywords', meta.keywords)
        }

        // Open Graph tags
        updateMeta('og:title', meta.title, true)
        if (meta.description) {
            updateMeta('og:description', meta.description, true)
        }
        if (meta.url) {
            updateMeta('og:url', meta.url, true)
        }
        if (meta.image) {
            updateMeta('og:image', meta.image, true)
        }
        updateMeta('og:type', meta.type || 'website', true)

        // Twitter Card tags
        updateMeta('twitter:title', meta.title)
        if (meta.description) {
            updateMeta('twitter:description', meta.description)
        }
        if (meta.image) {
            updateMeta('twitter:image', meta.image)
        }
        updateMeta('twitter:card', 'summary_large_image')
    }

    // If options is a function, watch for reactive changes
    if (typeof options === 'function') {
        const stopWatch = watch(options, applyMeta, { immediate: true, deep: true })

        onUnmounted(() => {
            stopWatch()
            restore()
        })
    } else {
        applyMeta()

        onUnmounted(restore)
    }
}
