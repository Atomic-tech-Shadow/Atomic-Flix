# ATOMIC FLIX - Anime Streaming Platform

## Overview

ATOMIC FLIX is a modern anime streaming platform built with React, TypeScript, and Vite, offering users the ability to search, browse, and stream anime content. The platform features a sleek, dark-themed interface with a comprehensive UI component library based on shadcn/ui and Radix UI primitives. The project is 100% frontend-only, using the external API `anime-sama-scraper.vercel.app` for all data.

## Recent Changes (October 25, 2025)

### API Integration Fixes
- **Schema Alignment**: Updated `shared/schema.ts` to match exactly the API response structures
- **Direct Data Access**: Fixed API response handling - the API returns data at the root level, not in a `data` field
- **Season Enrichment**: Enhanced anime details page to fetch complete season data from `/seasons/{id}` endpoint
- **Type Safety**: Added optional properties and fallbacks to prevent runtime errors with missing data

### Key Corrections
1. ✅ All interfaces in `shared/schema.ts` now match API documentation in `API-ENDPOINTS-STRUCTURE.md`
2. ✅ Fixed `VideoSource.serverNumber` (was incorrectly `serverIndex`)
3. ✅ Added missing interfaces: `PopularResponse`, `RecommendationsResponse`, `PlanningResponse`, `RecentEpisodesResponse`, etc.
4. ✅ Corrected anime details loading to use API data directly without `.data` wrapper
5. ✅ Enhanced season data with synopsis, languages, and episode count from `/seasons` endpoint

## User Preferences

Preferred communication style: Simple, everyday language (French).

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with custom CSS variables, class-variance-authority, clsx
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Animations**: Framer Motion for smooth transitions
- **Form Handling**: React Hook Form with Zod validation
- **Theming**: Consistent dark theme with a neon cyan/purple color scheme and glassmorphism effects.

### Backend
- **No backend**: 100% frontend-only architecture
- **External API**: anime-sama-scraper.vercel.app for all data
- **Build System**: Vite for frontend bundling

### Key Features
- **Anime Streaming**: Core functionality for playing video content.
- **Search & Browse**: Interface for discovering anime content.
- **UI Component Library**: Reusable and consistent UI elements.
- **PWA Optimization**: Enterprise-level PWA standards with manifest, service worker, and offline capabilities.
- **Notification System**: Streamlined notifications for new episodes.

### Project Structure
- `client/`: Frontend React application.
- `shared/`: Shared types and schemas that match API responses exactly.

## External Dependencies

### Frontend
- **UI Framework**: React, React DOM
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives suite
- **Animations**: Framer Motion, Embla Carousel
- **Forms**: React Hook Form, Hookform Resolvers
- **Utilities**: date-fns, cmdk
- **Analytics**: @vercel/analytics

### Backend (Development Only)
- **Server**: Express.js (for Vite dev server only)
- **Database**: None (using external API)
- **Validation**: Zod for client-side validation

### APIs
- **External Data Source**: anime-sama-scraper.vercel.app for all anime content data.
- **9 Endpoints**: /popular, /recommendations, /planning, /recent, /search, /anime/{id}, /seasons/{animeId}, /episodes/{animeId}, /embed
- **No Manga**: All manga functionality removed from API and site.

## API Response Structure Notes

### Important: Direct Data Access
The API returns data directly at the root level. For example:
```typescript
// ❌ INCORRECT
const data = apiResponse.data.title;

// ✅ CORRECT
const data = apiResponse.title;
```

### Season Data Structure
The `/seasons/{animeId}` endpoint provides richer data than `/anime/{id}`:
- Includes full synopsis for each season
- Lists available languages (VOSTFR, VF)
- Provides episode count
- Used to enrich anime detail pages

### Streaming Sources
Episode streaming sources are available in two ways:
1. Directly in `/episodes` response as `streamingSources[]`
2. Via `/embed?url={episodeUrl}` endpoint

Both return `serverNumber` (not `serverIndex`).

## Development Guidelines

### Type Consistency
Always use interfaces from `shared/schema.ts` that match the API documentation. Refer to `API-ENDPOINTS-STRUCTURE.md` for the complete API reference.

### Error Handling
- Check for `success: boolean` in API responses
- Provide user-friendly error messages
- Handle optional fields with fallbacks (e.g., `season.name || season.title`)

### Performance
- Use React Query for caching and optimistic updates
- Lazy load images with fallbacks
- Minimize re-renders with proper memoization
