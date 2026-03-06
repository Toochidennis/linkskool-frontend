# LinkSkool Frontend - Modern SaaS Learning Platform

A clean, modern SaaS landing page and course enrollment flow for LinkSkool, a Learning Management System built with Vue 3, TypeScript, and Tailwind CSS.

## 🎨 Design Features

- **Minimal, elegant SaaS aesthetic** inspired by Coursera and Stripe
- **Blue & orange color palette** with gradients
- **Smooth animations** with hover effects and transitions
- **Fully responsive** design for all devices
- **Clean typography** using Inter and Space Grotesk
- **Card-based layouts** with soft shadows and generous whitespace

## 📁 Project Structure

```
src/
├── components/
│   ├── AppHeader.vue          # Navigation header with mobile menu
│   ├── AppFooter.vue          # Multi-column footer with newsletter
│   ├── HeroSection.vue        # Landing page hero with animations
│   ├── ProgramCard.vue        # Program card component
│   ├── CourseCard.vue         # Course card with pricing
│   ├── EnrollmentCard.vue     # Sticky enrollment card
│   └── EnrollmentForm.vue     # Modal form for enrollment
├── views/
│   ├── LandingPage.vue        # Main landing page
│   ├── ProgramPage.vue       # Program details with courses
│   └── CourseDetailPage.vue   # Course details with enrollment
├── api/
│   └── models/               # TypeScript models
└── router/
    └── index.ts              # Route definitions
```

## 🛣️ Routes

- `/` - Landing page with hero and programs
- `/programs/:programId` - Program page showing courses
- `/courses/:courseId` - Course details with enrollment

## 🎯 Key Components

### 1. Hero Section

- Animated gradient background with blob animations
- Call-to-action buttons
- Stats display (students, courses, satisfaction)
- Floating achievement cards

### 2. Programs Section

- Grid of program cards
- Hover animations with elevation
- Course count badges
- Responsive layout (1, 2, or 3 columns)

### 3. Program Page

- Program header with breadcrumbs
- Description and metadata
- Grid of courses in the program
- Related programs section

### 4. Course Detail Page

- **Left Column:**
  - Video or image media
  - Course name and title
  - Description
  - Benefits list with checkmarks
  - Instructor information

- **Right Column (Sticky):**
  - Price display with discounts
  - Enrollment buttons (Enroll Now, Reserve Seat)
  - Course information (dates, instructor)
  - Additional features list

### 5. Enrollment Form

- Modal dialog with fade-in animation
- Form fields:
  - First Name
  - Last Name
  - Email
  - Phone Number
- Client-side validation
- Loading states

## 🎨 Color Scheme

```css
Primary Blue:
- #1e40af (primary)
- #3b82f6 (primary-light)
- #60a5fa (primary-lighter)
- #dbeafe (primary-lightest)

Orange/Accent:
- #f97316 (orange)
- #fb923c (orange-light)
- #fdba74 (orange-lighter)
- #ffedd5 (orange-lightest)

Secondary:
- #f59e0b (gold)
```

## 🚀 Features

### Price Display Logic

- Free courses show "Free" badge
- Discounts show:
  - Original price (struck through)
  - Discounted price
  - Discount percentage badge
- Trial badges for courses with trials:
  - "X days trial"
  - "X views trial"

### Animations

- Blob animations on hero background
- Floating cards
- Hover effects on cards (scale, shadow, translation)
- Smooth page transitions
- Modal fade-in animations

### Responsive Design

- Mobile-first approach
- Hamburger menu on mobile
- Adaptive grid layouts
- Touch-friendly interactions

## 📦 Dependencies

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **Vue Router 5** - Official routing
- **Pinia** - State management (if needed)
- **FontAwesome** - Icons

## 🛠️ Development

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Type checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 🔌 API Integration

The components are designed to work with the following data models:

### Program

```typescript
{
  programId: number
  name: string
  description: string
  imageUrl: string | null
  courses: Course[]
}
```

### Course

```typescript
{
  courseId: number
  slug: string
  courseName: string
  description: string
  imageUrl: string | null
  videoUrl: string | null
  hasActiveCohort: boolean
  cohortId: number | null
  isFree: boolean
  trialType: 'views' | 'days' | null
  trialValue: number | null
  discount: number | null
  cost: number
}
```

### CourseDetail

```typescript
{
  id: number
  programId: number
  courseId: number
  slug: string
  courseName: string
  title: string
  description: string
  benefits: string | null // JSON string array
  startDate: string
  endDate: string
  imageUrl: string | null
  videoUrl: string | null
  cost: number | null
  discount: number | null
  instructorName: string | null
  // ... additional fields
}
```

## 🎯 To-Do

To integrate with your actual API:

1. Uncomment the API service imports in each view
2. Replace mock data with actual API calls
3. Update the `programService` and `courseService` implementations
4. Add error handling and loading states
5. Implement actual payment integration

## 📝 Notes

- The logo should be placed at `src/assets/logo.png`
- Benefits in `CourseDetail` are stored as JSON string and parsed in the component
- Form validation is client-side only; add server-side validation in production
- Images are using Unsplash placeholders; replace with actual course images

## 🎨 Customization

### Colors

Edit the color palette in `src/assets/styles/index.css`:

```css
@theme {
  --color-primary: #1e40af;
  --color-orange: #f97316;
  /* ... */
}
```

### Fonts

Fonts are defined in the same file. Current fonts:

- **Sans:** Inter, Plus Jakarta Sans
- **Display:** Space Grotesk, Poppins

### Animations

All animations are defined inline in components using:

- CSS `@keyframes`
- Tailwind animation utilities
- Vue transitions

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

[Your License Here]

## 👥 Contributors

[Your Name/Team]

---

**Built with ❤️ using Vue 3 + TypeScript + Tailwind CSS**
