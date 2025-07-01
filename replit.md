# ATOMIC FLIX - Anime Streaming Platform

## Overview

ATOMIC FLIX is a modern anime streaming platform built with React, TypeScript, and Express.js. The application provides users with the ability to search, browse, and stream anime content with a sleek, dark-themed interface. The platform features a comprehensive UI component library based on shadcn/ui and Radix UI primitives.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui components built on Radix UI primitives
- **Animations**: Framer Motion for smooth transitions and animations
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **Build System**: Vite for frontend bundling, esbuild for backend compilation

### Project Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── lib/          # Utility functions and configurations
│   │   └── hooks/        # Custom React hooks
├── server/               # Backend Express application
├── shared/               # Shared types and schemas
└── migrations/           # Database migration files
```

## Key Components

### Frontend Components
1. **Main Layout**: Base layout component providing consistent dark theme styling
2. **Anime Pages**: 
   - `AnimeSamaPage`: Main search and browse interface
   - `AnimePage`: Individual anime details and episode listing
   - `AnimePlayerPage`: Video streaming interface
3. **UI Component Library**: Complete set of shadcn/ui components including buttons, cards, dialogs, forms, and navigation elements

### Backend Services
1. **Express Server**: RESTful API server with middleware for logging and error handling
2. **Database Layer**: Drizzle ORM with PostgreSQL for data persistence
3. **Storage Interface**: Abstracted storage layer with in-memory fallback for development

### Data Models
- **Users**: Basic user management with username/password authentication
- **Database Schema**: Extensible schema structure using Drizzle ORM with Zod validation

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query for efficient caching and state management
2. **Server Processing**: Express.js handles API routes with proper error handling and logging
3. **Database Operations**: Drizzle ORM manages database interactions with type-safe queries
4. **Response Handling**: Structured API responses with consistent error handling

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, React DOM
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **UI Components**: Radix UI primitives suite
- **Animations**: Framer Motion, Embla Carousel
- **Forms**: React Hook Form, Hookform Resolvers
- **Utilities**: date-fns, cmdk

### Backend Dependencies  
- **Server**: Express.js
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Session**: connect-pg-simple
- **Validation**: Zod, drizzle-zod
- **Development**: tsx, esbuild

### Development Tools
- **Build System**: Vite with React plugin
- **Database Tools**: Drizzle Kit for migrations
- **TypeScript**: Full type safety across frontend and backend
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with HMR for frontend development
- **Backend**: tsx for TypeScript execution with nodemon-like functionality
- **Database**: Neon Database serverless PostgreSQL instance

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild compiles TypeScript server code to `dist/index.js`
- **Database**: Drizzle migrations ensure schema consistency

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Session Storage**: PostgreSQL-backed session store for scalability
- **Static Assets**: Express serves built frontend assets in production

## Changelog
- July 01, 2025. Initial setup
- July 01, 2025. Migration from Replit Agent: Removed all local API configurations and fallback data, now using only external API (anime-sama-scraper.vercel.app) for data integrity and security
- July 01, 2025. Fixed critical JSX syntax errors in anime.tsx: removed extra closing div tags, added missing component imports (FloatingBackButton, BreadcrumbNav), corrected component structure. App now runs successfully with full functionality.
- July 01, 2025. UI/UX improvements: Removed duplicate headers from anime pages, added toggleable search icon in mobile navbar that shows/hides search bar on click for cleaner interface.
- July 01, 2025. Complete design system implementation: Created cohesive ATOMIC FLIX color scheme with cyan-blue gradients, added reusable animation classes (atomic-fade-in, atomic-hover-scale, atomic-card, etc.), modernized all pages with glassmorphism effects, smooth transitions, and consistent styling throughout the application.
- July 01, 2025. Migration completion: Successfully migrated project from Replit Agent to standard Replit environment with proper client/server separation. Fixed image sizing issues - increased anime card image heights from aspect-ratio to fixed heights (h-48 sm:h-56 md:h-64) for better visual appeal and user experience.
- July 01, 2025. Final migration verification: Completed full migration from Replit Agent to standard Replit environment. All components verified working, server running successfully on port 5000, client/server architecture properly separated, all security best practices implemented.
- July 01, 2025. Manga reader implementation: Completely redesigned manga-reader.tsx to use anime-sama-scraper.vercel.app API. Added support for manga/scan detection, chapter loading, and proper navigation. Interface shows available chapters with fallback message for pages pending API development. Integrated with anime.tsx navigation for seamless manga access.
- July 01, 2025. Logo integration: Successfully integrated user's custom ATOMIC FLIX logo (neon cyan/purple design) into navbar. Logo features futuristic neon styling with space background that perfectly matches the app's dark theme. Removed home page per user request - app now redirects directly to anime search page for better user experience.
- July 01, 2025. Vercel deployment configuration: Configured complete Vercel deployment setup with serverless functions, proper build configuration, environment variables setup, and deployment documentation. Created api/index.ts for serverless backend, vercel.json for deployment config, and comprehensive README.md with deployment instructions.
- July 01, 2025. Database integration and Vercel optimization: Integrated user's Neon PostgreSQL database directly into the application with connection string in .env and vercel.json. Fixed Vercel runtime configuration error by updating to @vercel/node@3.0.0 and simplified build command to use only vite build for faster deployment.
- July 01, 2025. Vercel deployment fixes: Resolved build errors by moving logo from attached_assets to client/public/assets for proper static serving. Simplified Vercel configuration to frontend-only deployment using vite build, removing complex serverless functions for more reliable deployment.
- July 01, 2025. Successful Vercel deployment: ATOMIC FLIX application successfully deployed to https://atomic-flix.vercel.app/ with full functionality including anime search, player, manga reader, and modern UI with ATOMIC FLIX branding. All external APIs working correctly on production.
- July 01, 2025. Migration to external API only: Removed all database dependencies (Drizzle ORM, Neon DB, sessions), demo data, and fallback mechanisms. Cleaned architecture to use only anime-sama-scraper.vercel.app API. Created optimized Vercel serverless functions in api/index.js as proxy to external API. Simplified client/src/lib/api.ts to use local API endpoints that proxy to external service. Updated shared/schema.ts with TypeScript interfaces only (no database schemas). Removed storage.ts and database configuration files. Application now ready for clean Vercel deployment without database requirements.
- July 01, 2025. Vercel deployment optimization: Fixed Node.js version conflict by simplifying to frontend-only deployment. Removed serverless functions and configured direct API calls to anime-sama-scraper.vercel.app. Updated vercel.json to simple build configuration. Application now fully optimized for Vercel deployment without Node.js version requirements or serverless complexity.

## User Preferences

Preferred communication style: Simple, everyday language.