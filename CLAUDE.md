# CLAUDE.md - AI Assistant Rules for Kadaver Project

## Project Overview
Kadaver is a modern, artistic website for a poetry society featuring poems in German, Russian, and English. The site emphasizes artistic expression, smooth scrolling experiences, and community features for poets.

## Core Principles

### 1. Poetry-First Development
- Every code decision should enhance the reading experience
- Typography and text flow are paramount
- Preserve the artistic integrity of poems (line breaks, spacing, formatting)
- Never use Lorem Ipsum - always use real poetry for testing

### 2. Design Philosophy
- **Aesthetic**: Brutalist-meets-poetry with raw, handwritten elements
- **NOT**: Corporate, minimalist, or sterile designs
- **Colors**: Ink black (#0A0A0A), blood red (#8B0000), paper (#FAFAF8), gold leaf (#FFD700)
- **Typography**: Playfair Display for headings, Inter for body, JetBrains Mono for code
- Always include paper texture and noise overlays for authenticity

### 3. Multi-Language Implementation
- **Always** implement features for all three languages: German (de), Russian (ru), English (en)
- Use URL-based routing: `/de/`, `/ru/`, `/en/`
- Store language preference in cookies
- Implement proper RTL support for future Arabic poetry
- Use ISO 639-1 language codes consistently

### 4. Technical Standards
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom utilities
- **Animations**: Framer Motion for smooth scrolls, GSAP for complex animations
- **Content**: MDX files with Contentlayer
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase

### 5. Performance Guidelines
- Optimize for smooth 60fps scrolling
- Lazy load images and heavy components
- Use Next.js Image component for all images
- Implement virtual scrolling for long poem lists
- Cache poems aggressively (15-minute minimum)
- Bundle size should not exceed 200KB for initial load

### 6. Accessibility Requirements
- Ensure all poems are screen-reader accessible
- Maintain WCAG 2.1 AA compliance
- Provide keyboard navigation for all interactive elements
- Include alt text for all images
- Support browser zoom up to 200%
- High contrast mode support

### 7. Content Management
- Poems stored as MDX files in `/content/poems/`
- Metadata includes: author, language, tags, date, audio_url
- Version control poems separately from code changes
- Support for audio recordings of each poem
- Implement revision history for poems

### 8. Component Architecture
```
components/
├── poems/
│   ├── PoemCard.tsx
│   ├── PoemReader.tsx
│   └── PoemAudio.tsx
├── navigation/
│   ├── ScrollProgress.tsx
│   └── LanguageSwitcher.tsx
├── animations/
│   └── ScrollReveal.tsx
└── ui/
    ├── TagCloud.tsx
    └── InfiniteScroll.tsx
```

### 9. Testing Requirements
- Test with actual poetry content in all three languages
- Verify scroll performance on mobile devices
- Test with screen readers
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Test offline functionality
- Performance testing with Lighthouse (aim for 95+ score)

### 10. Git Commit Standards
- Prefix commits: `feat:`, `fix:`, `style:`, `perf:`, `docs:`, `test:`, `chore:`
- Separate poem additions from code changes
- Example: `feat: add infinite scroll to poetry feed`
- Example: `content: add Rilke poems in German`

### 11. Security Considerations
- Sanitize all user-submitted content
- Implement rate limiting for submissions
- No inline scripts or styles
- Use Content Security Policy headers
- Regular dependency updates
- Never expose API keys or secrets

### 12. SEO Requirements
- Unique meta descriptions for each poem
- Structured data for poetry (use Schema.org CreativeWork)
- Open Graph tags for social sharing
- XML sitemap generation
- Canonical URLs for multi-language content
- Rich snippets for Google

### 13. Animation Guidelines
- Subtle parallax effects (max 20px movement)
- Text reveals on scroll (stagger by 0.1s)
- Smooth page transitions (300-500ms)
- No auto-playing videos
- Respect prefers-reduced-motion

### 14. Error Handling
- Custom 404 page with random poem
- Graceful degradation without JavaScript
- Offline mode with cached poems
- User-friendly error messages in all languages
- Error boundaries around poem components

### 15. Documentation Standards
- Document all custom hooks
- API endpoint documentation
- Component prop types
- Environment variables in `.env.example`
- README in all three languages

## File Naming Conventions
- Components: PascalCase (e.g., `PoemCard.tsx`)
- Utilities: camelCase (e.g., `formatPoem.ts`)
- Styles: kebab-case (e.g., `poem-reader.module.css`)
- MDX poems: `[language]-[author]-[title].mdx`

## Environment Variables
```
NEXT_PUBLIC_SITE_URL=
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
NEXT_PUBLIC_GA_ID=
```

## Commands to Run
```bash
npm run dev        # Development server
npm run build      # Production build
npm run test       # Run tests
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```

## Deployment Checklist
- [ ] All poems have proper metadata
- [ ] Images optimized and using Next Image
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate active
- [ ] CDN configured for static assets
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Backup strategy implemented

## Important Notes
- Always prioritize the reading experience over fancy features
- Respect the artistic nature of poetry - avoid over-engineering
- Keep the interface unobtrusive - let the poetry shine
- Test with real poets and gather feedback
- Remember: This is art, not just code