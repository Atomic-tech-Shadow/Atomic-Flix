# ATOMIC FLIX - Anime Streaming Platform

## Overview

ATOMIC FLIX is a modern anime streaming platform built with React, TypeScript, and Vite, offering users the ability to search, browse, and stream anime content. The platform features a sleek, dark-themed interface with a comprehensive UI component library based on shadcn/ui and Radix UI primitives. The project is 100% frontend-only, using the external API `anime-sama-scraper.vercel.app` for all data.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- `shared/`: Shared types and schemas.

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

### Backend
- **Server**: Express.js
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Session**: connect-pg-simple
- **Validation**: Zod, drizzle-zod

### APIs
- **External Data Source**: anime-sama-scraper.vercel.app for all anime content data.
- **9 Endpoints**: /popular, /recommendations, /planning, /recent, /search, /anime/{id}, /seasons/{animeId}, /episodes/{animeId}, /embed
- **No Manga**: All manga functionality removed from API and site.