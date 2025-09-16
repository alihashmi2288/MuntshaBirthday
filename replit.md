# Birthday Celebration App - Shin Chan Theme

## Overview

This is a special animated birthday celebration web application created with a Shin Chan anime theme. The app features an interactive birthday experience with multiple pages including a landing page, memory game, love letter, and fireworks display. Built as a full-stack TypeScript application using React, Express, and modern web technologies, it provides a playful and engaging user experience with cartoon-style animations, music integration, and personalized messaging.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing with pages for Birthday, Game, Letter, and Fireworks
- **UI Framework**: Shadcn/ui component library with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens implementing a Shin Chan-inspired color palette (bright orange-yellow primary, cheerful blue secondary, playful pink accent)
- **Typography**: Google Fonts integration featuring 'Fredoka One' for playful headings and 'Nunito' for readable body text
- **Animations**: Custom CSS animations including floating elements, typewriter effects, confetti, and fireworks using CSS transforms and keyframes

### Backend Architecture
- **Server**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API structure with `/api` prefix routing (currently minimal implementation)
- **Development**: Hot module replacement via Vite middleware integration for seamless development experience
- **Static Assets**: Vite handles asset bundling and optimization with custom alias configuration

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL with schema definitions in TypeScript
- **Database**: PostgreSQL via Neon serverless database connection
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Schema**: User management with UUID primary keys, username/password authentication structure

### State Management
- **Client State**: React Query (TanStack Query) for server state management with custom query client configuration
- **Local State**: React hooks (useState, useEffect) for component-level state
- **Form Handling**: React Hook Form with Zod validation schemas for type-safe form management
- **Theme Management**: Local storage persistence with system preference detection for dark/light mode

### Component Architecture
- **Design System**: Comprehensive component library with variants using class-variance-authority
- **Accessibility**: Radix UI primitives ensure WCAG compliance across interactive components
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Animation Components**: Custom floating elements, typewriter text effects, and interactive game components
- **Audio Integration**: Web Audio API implementation for birthday music and sound effects

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for modern React development patterns
- **Build Tools**: Vite with TypeScript, ESBuild for fast compilation and hot reloading
- **Routing**: Wouter for lightweight single-page application navigation

### UI and Styling
- **Component Library**: Radix UI primitives (accordion, alert-dialog, avatar, button, etc.) for accessible base components
- **Styling**: Tailwind CSS with PostCSS for utility-first styling and design consistency
- **Icons**: Lucide React for consistent iconography throughout the application
- **Fonts**: Google Fonts API for custom typography (Fredoka One, Nunito)

### Database and Backend
- **Database**: Neon PostgreSQL serverless database for scalable data storage
- **ORM**: Drizzle ORM with Drizzle Kit for database migrations and schema management
- **Validation**: Zod for runtime type validation and schema definition
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Development and Deployment
- **Type Checking**: TypeScript with strict configuration for type safety
- **Development**: TSX for TypeScript execution, Replit integration for cloud development
- **Asset Management**: Attached assets directory for static images and generated content
- **Error Handling**: Custom error boundary implementation with development overlays