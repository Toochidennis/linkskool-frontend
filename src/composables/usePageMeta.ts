import { watch, onUnmounted } from 'vue'

interface PageMetaOptions {
    title: string
    description?: string
    keywords?: string
    image?: string
    url?: string
    type?: string
}

/**
 * Composable to dynamically update page meta tags for SEO and social media sharing
 * Updates document title, description, Open Graph, and Twitter Card tags
 */
export function usePageMeta(options: PageMetaOptions | (() => PageMetaOptions)) {
    const metaTags = new Map<string, HTMLMetaElement>()
    const originalTitle = document.title

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
            document.title = originalTitle
        })
    } else {
        applyMeta()

        onUnmounted(() => {
            document.title = originalTitle
        })
    }
}
