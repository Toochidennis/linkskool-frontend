# Dynamic Meta Tags & Direct URL Access - Implementation Guide

## ✅ What Was Implemented

### 1. **Direct URL Access (Independent Page Loading)**

All pages now fetch their own data based on URL parameters:

- **Landing Page** (`/`)
  - Loads program list independently
- **Program Page** (`/programs/:programSlug`)
  - Uses `programSlug` from URL to fetch program + courses
  - Works independently: `https://linkskool.com/programs/web-development`
- **Course Detail Page** (`/courses/:courseId`)
  - Uses `courseId` from URL to fetch course details
  - Works independently: `https://linkskool.com/courses/123`
- **Program Enrollment** (`/programs/:programSlug/enroll`)
  - Uses `programSlug` from URL to fetch enrollment data
  - Works independently: `https://linkskool.com/programs/web-development/enroll`

✅ **You can now copy any URL and share it directly** - the page will load its own data.

---

### 2. **Dynamic Meta Tags for Social Sharing**

Created `usePageMeta` composable that dynamically updates:

- `<title>` tag
- `<meta name="description">`
- `<meta name="keywords">`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter Card tags (`twitter:title`, `twitter:description`, `twitter:image`)

**Implemented on all pages:**

| Page       | Title Format                                                 | Description Source                         |
| ---------- | ------------------------------------------------------------ | ------------------------------------------ |
| Landing    | "Linkskool - Your Gateway to Learning and Skill Development" | Static                                     |
| Program    | "[Program Name] \| Learn with Linkskool"                     | `program.name` + `program.description`     |
| Course     | "[Course Name] - Professional Course \| Linkskool"           | `course.courseName` + `course.description` |
| Enrollment | "Enroll in [Program Name] \| Linkskool"                      | `program.name` + `program.description`     |

---

## 🧪 How to Test

### Test 1: Direct URL Access

1. **Without being on homepage**, open browser and go directly to:
   ```
   http://localhost:5173/programs/web-development
   ```
2. **Expected Result:** Page loads correctly with program data
3. **Try enrollment page directly:**
   ```
   http://localhost:5173/programs/web-development/enroll
   ```
4. **Expected Result:** Enrollment page loads with course selection

### Test 2: Dynamic Page Titles

1. Start dev server: `npm run dev`
2. Open browser DevTools Console
3. Navigate to different pages and run:
   ```javascript
   document.title
   ```
4. **Expected Results:**
   - Landing: "Linkskool - Your Gateway to Learning and Skill Development"
   - Program: "Web Development | Learn with Linkskool"
   - Course: "Introduction to React - Professional Course | Linkskool"
   - Enrollment: "Enroll in Web Development | Linkskool"

### Test 3: Social Media Meta Tags

1. Navigate to any page (program/course)
2. Open DevTools Console and run:

   ```javascript
   // Check Open Graph title
   document.querySelector('meta[property="og:title"]')?.content

   // Check Open Graph description
   document.querySelector('meta[property="og:description"]')?.content

   // Check Open Graph URL
   document.querySelector('meta[property="og:url"]')?.content

   // Check Twitter title
   document.querySelector('meta[name="twitter:title"]')?.content
   ```

3. **Expected Result:** Each meta tag shows page-specific content

### Test 4: Social Media Preview Testing

Use these tools to test how your pages appear when shared:

1. **Facebook Sharing Debugger**

   ```
   https://developers.facebook.com/tools/debug/
   ```

   - Paste your page URL (e.g., `https://linkskool.com/programs/web-development`)
   - Click "Debug" to see preview

2. **Twitter Card Validator**

   ```
   https://cards-dev.twitter.com/validator
   ```

   - Paste your page URL
   - See how it appears on Twitter

3. **LinkedIn Post Inspector**
   ```
   https://www.linkedin.com/post-inspector/
   ```

   - Inspect how links appear on LinkedIn

### Test 5: Shareable Links

1. Navigate to a program enrollment page
2. Copy the URL from address bar:
   ```
   http://localhost:5173/programs/data-science/enroll
   ```
3. Open **new incognito window** (to simulate fresh user)
4. Paste the URL directly
5. **Expected Result:** Page loads correctly with all data

---

## 📋 Technical Implementation Details

### File Structure

```
src/
├── composables/
│   └── usePageMeta.ts       # Meta tag management composable
├── views/
│   ├── LandingPage.vue      # Static meta tags
│   ├── ProgramPage.vue      # Dynamic meta (program data)
│   ├── CourseDetailPage.vue # Dynamic meta (course data)
│   └── ProgramEnrollmentPage.vue # Dynamic meta (enrollment data)
```

### How It Works

**1. usePageMeta Composable:**

```typescript
usePageMeta(() => ({
  title: program.value ? `${program.value.name} | Learn with Linkskool` : 'Program | Linkskool',
  description: program.value?.description || 'Default...',
  url: `https://linkskool.com/programs/${programRef.value}`,
  // ... more meta tags
}))
```

**2. Reactive Updates:**

- When `program.value` changes (after API fetch), meta tags auto-update
- Uses Vue's `watch()` to track changes in reactive data
- Automatically cleans up on component unmount

**3. SEO Benefits:**

- ✅ Unique page titles for better Google rankings
- ✅ Proper Open Graph for Facebook/LinkedIn shares
- ✅ Twitter Card support for Twitter shares
- ✅ Dynamic descriptions improve click-through rates

---

## 🚀 Production Deployment Checklist

Before deploying to production:

### 1. Update OG Image

- [ ] Create 1200x630px branded image
- [ ] Save to `public/assets/og-image.png`
- [ ] Or update URLs in composable calls to use course/program images

### 2. Update Base URLs

Replace all instances of `https://linkskool.com` with your actual domain:

```bash
# Search for hardcoded URLs
grep -r "linkskool.com" src/
```

### 3. Test with Real API Data

- [ ] Ensure API returns proper `description` fields
- [ ] Verify `imageUrl` fields are populated
- [ ] Test with long and short program/course names

### 4. Server Configuration (SPA Mode)

Since this is a Vue SPA, configure your server to handle direct URLs:

**Nginx:**

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Vercel (vercel.json):**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 5. Monitor Social Shares

After deployment:

- [ ] Test Facebook sharing with real URL
- [ ] Test Twitter card preview
- [ ] Test LinkedIn post preview
- [ ] Verify Google Search Console indexing

---

## 🐛 Troubleshooting

### Issue: Page shows default title instead of dynamic title

**Cause:** Data hasn't loaded yet
**Solution:** Check if API is returning data correctly

### Issue: Meta tags not updating on navigation

**Cause:** Composable might not be watching reactive data
**Solution:** Ensure you're passing a function to `usePageMeta()` for dynamic data:

```typescript
// ✅ Correct (reactive)
usePageMeta(() => ({ title: program.value?.name }))

// ❌ Wrong (static snapshot)
usePageMeta({ title: program.value?.name })
```

### Issue: Direct URL shows 404 in production

**Cause:** Server not configured for SPA routing
**Solution:** Add server rewrite rules (see Server Configuration above)

### Issue: Social preview shows old data

**Cause:** Facebook/Twitter cache old meta tags
**Solution:** Use debugging tools to force refresh:

- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: Delete tweet and reshare

---

## ✅ Success Criteria

Your implementation is working correctly when:

1. ✅ Any page URL can be opened directly in fresh browser tab
2. ✅ Each page shows unique title in browser tab
3. ✅ Sharing on Facebook shows page-specific image and description
4. ✅ Sharing on Twitter shows correct card preview
5. ✅ Google Search shows unique titles and descriptions per page
6. ✅ No 404 errors when accessing direct URLs in production

---

## 📊 Expected Results

### Before Implementation

- ❌ All pages showed "Linkskool" title
- ❌ Generic description for all pages
- ❌ Same OG image for all pages
- ❌ Direct URLs might fail if data not in state

### After Implementation

- ✅ Unique titles per page type
- ✅ Dynamic descriptions from API data
- ✅ Page-specific OG URLs
- ✅ All pages work independently via direct URL
- ✅ Shareable links work for every page
- ✅ SEO-friendly meta tags for better ranking

---

## 📚 Additional Resources

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Vue Router Hash vs History Mode](https://router.vuejs.org/guide/essentials/history-mode.html)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
