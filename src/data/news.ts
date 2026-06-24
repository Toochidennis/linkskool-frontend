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

export const newsCategories: NewsCategory[] = [
  'Top Stories',
  'Campus',
  'Opportunities',
  'Technology',
  'Community',
]

export const newsItems: NewsCard[] = [
  {
    id: 1,
    slug: 'new-cohort-product-data-cloud-tracks',
    title: 'New cohort opens with practical product, data, and cloud tracks',
    summary:
      'The newest learning window focuses on portfolio-ready projects, mentor reviews, and a tighter path from enrollment to interview readiness.',
    body: [
      'LinkSkool has opened a new cohort built around practical product, data, and cloud learning tracks. The focus is on shipping work that learners can explain clearly, improve through review, and present with confidence.',
      'Each track combines guided lessons with portfolio tasks, mentor feedback, and checkpoints that help students understand where they are strong and where they need more practice.',
      'The cohort also places more attention on interview readiness, including project walkthroughs, technical communication, and small habits that make learner work easier for hiring teams to evaluate.',
    ],
    category: 'Top Stories',
    source: 'LinkSkool Desk',
    publishedAt: 'Today',
    readTime: '4 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Students collaborating around laptops in a classroom',
    size: 'horizontal',
    accent: 'blue',
  },
  {
    id: 2,
    slug: 'portfolio-mistakes-recruiters-notice-first',
    title: 'Five portfolio mistakes recruiters still notice first',
    summary:
      'Small gaps in case studies, project context, and measurable outcomes can hide otherwise strong technical work.',
    body: [
      'Recruiters often scan portfolios quickly, so missing context can weaken a project before the work is properly reviewed. Strong portfolios explain the problem, the role played, and the tradeoffs behind the final result.',
      'The most common issues are vague project descriptions, screenshots without process notes, missing links, weak README files, and no clear explanation of impact.',
      'A better portfolio does not need to be large. It needs to be understandable, honest, and specific about what was built and why the decisions mattered.',
    ],
    category: 'Opportunities',
    source: 'Career Lab',
    publishedAt: '2h ago',
    readTime: '3 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Portfolio notes and charts on a desk',
    size: 'square',
    accent: 'orange',
  },
  {
    id: 3,
    slug: 'inside-this-weeks-design-critique-room',
    title: 'Inside this week’s design critique room',
    summary:
      'Learners reviewed onboarding flows, pricing pages, and accessibility issues with live feedback from mentors.',
    body: [
      'This week’s critique room focused on practical interface decisions across onboarding, pricing, and accessibility flows. Learners presented work, received feedback, and revised their assumptions in real time.',
      'Mentors pushed students to explain user intent, content hierarchy, and the business reason behind each screen. The goal was to make design choices easier to defend.',
      'The strongest reviews came from projects where learners connected visual polish with clarity, conversion, and user trust.',
    ],
    category: 'Campus',
    source: 'Studio Notes',
    publishedAt: '4h ago',
    readTime: '2 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Team discussing interface designs on a wall',
    size: 'square',
    accent: 'violet',
  },
  {
    id: 4,
    slug: 'ai-assisted-learning-speed-helps-hurts',
    title: 'AI-assisted learning: where speed helps and where it hurts',
    summary:
      'A practical look at using AI for drills, explanations, and review without skipping the thinking that builds skill.',
    body: [
      'AI can make learning faster when it is used for feedback, examples, and guided practice. It becomes less useful when it replaces the learner’s own reasoning.',
      'Students are encouraged to use AI to compare approaches, test understanding, and review mistakes, while still writing explanations and solving problems independently.',
      'The best results come from treating AI like a coach, not a shortcut. The learner still needs to make decisions and understand the work.',
    ],
    category: 'Technology',
    source: 'Tech Brief',
    publishedAt: 'Yesterday',
    readTime: '5 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Abstract artificial intelligence interface on a screen',
    size: 'square',
    accent: 'green',
  },
  {
    id: 5,
    slug: 'alumni-circle-monthly-review-sessions',
    title: 'Alumni circle launches monthly review sessions',
    summary:
      'Graduates are pairing with current learners for mock interviews, code reviews, and project polish.',
    body: [
      'The alumni circle is starting monthly review sessions for current learners who want more practice before applying for roles or presenting projects.',
      'Sessions will cover mock interviews, project walkthroughs, code reviews, and portfolio cleanup. Alumni will share practical lessons from their own transition into work.',
      'The structure gives learners another feedback loop outside regular classes and helps graduates stay connected to the community.',
    ],
    category: 'Community',
    source: 'Community',
    publishedAt: 'Yesterday',
    readTime: '3 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'People in a warm community meetup',
    size: 'square',
    accent: 'rose',
  },
  {
    id: 6,
    slug: 'frontend-hiring-changes-this-quarter',
    title: 'What changed in frontend hiring this quarter',
    summary:
      'Teams are asking for stronger testing habits, state management clarity, and production debugging stories.',
    body: [
      'Frontend hiring has shifted toward practical engineering judgment. Teams still care about UI skill, but they now ask more questions about testing, debugging, and maintainable state management.',
      'Candidates who can explain production tradeoffs usually stand out. Interviewers want to know how developers handle slow pages, broken flows, and unclear requirements.',
      'Learners preparing for frontend roles should document debugging stories and include tests or quality notes in portfolio projects where possible.',
    ],
    category: 'Opportunities',
    source: 'Market Watch',
    publishedAt: 'Jun 22',
    readTime: '4 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Software team working in an office',
    size: 'square',
    accent: 'blue',
  },
  {
    id: 7,
    slug: 'weekend-lab-deploy-measure-performance',
    title: 'Weekend lab: deploy a small app and measure its performance',
    summary:
      'The lab combines hosting, bundle inspection, analytics, and a short write-up learners can add to portfolios.',
    body: [
      'The weekend lab asks learners to deploy a small application and measure how it performs after release. The exercise connects build work with real delivery habits.',
      'Students will inspect bundle size, check page speed, review basic analytics, and write a short summary of what they improved.',
      'The final write-up can be added to a portfolio because it shows more than coding ability. It shows care for user experience after launch.',
    ],
    category: 'Technology',
    source: 'Build Lab',
    publishedAt: 'Jun 21',
    readTime: '2 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Developer reviewing analytics on a laptop',
    size: 'square',
    accent: 'orange',
  },
  {
    id: 8,
    slug: 'learner-spotlight-customer-support-qa-automation',
    title: 'Learner spotlight: from customer support to QA automation',
    summary:
      'A practical transition story covering study rhythm, first project scope, and interview preparation.',
    body: [
      'This learner spotlight follows a transition from customer support into QA automation. The journey started with structured study blocks and small testing exercises.',
      'The first portfolio project focused on writing clear test cases, automating repeatable flows, and explaining why those checks mattered.',
      'Interview preparation centered on communication: describing bugs clearly, explaining automation choices, and showing how support experience became a strength.',
    ],
    category: 'Community',
    source: 'Spotlight',
    publishedAt: 'Jun 20',
    readTime: '6 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Person smiling while working at a laptop',
    size: 'square',
    accent: 'green',
  },
  {
    id: 9,
    slug: 'scholarship-watch-next-intake',
    title: 'Scholarship watch: where to look before the next intake',
    summary:
      'A quick roundup of learning support routes, application habits, and documents worth preparing early.',
    body: [
      'Scholarship preparation works best when learners start before applications open. The strongest applicants usually have documents, goals, and project evidence ready early.',
      'Students should prepare a short personal statement, proof of learning effort, and links to any relevant work they have completed.',
      'The opportunity desk will keep tracking support routes and reminders for the next intake window.',
    ],
    category: 'Opportunities',
    source: 'Opportunity Desk',
    publishedAt: 'Jun 19',
    readTime: '3 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Students walking across a campus',
    size: 'square',
    accent: 'violet',
  },
  {
    id: 10,
    slug: 'partner-workshops-product-thinking-weekend-classes',
    title: 'Partner workshops bring product thinking into weekend classes',
    summary:
      'Upcoming sessions connect learners with product leads, engineers, and founders working on practical business problems.',
    body: [
      'Partner workshops are bringing more product thinking into weekend classes. The sessions connect learners with people solving business problems in real teams.',
      'The workshops will cover discovery, prioritization, technical tradeoffs, and how teams decide what to ship first.',
      'Learners will leave with practical notes they can apply to class projects and portfolio case studies.',
    ],
    category: 'Campus',
    source: 'Partner Desk',
    publishedAt: 'Jun 18',
    readTime: '4 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Workshop facilitator speaking to a group',
    size: 'horizontal',
    accent: 'blue',
  },
]

export const getNewsBySlug = (slug: string) => newsItems.find((item) => item.slug === slug)
