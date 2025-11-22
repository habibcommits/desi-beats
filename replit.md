# DESI Beats Café - Food Ordering Platform

## Overview

DESI Beats Café is a full-stack web application for ordering authentic Pakistani cuisine online. The platform enables customers to browse menu items by category, add items to cart, and place orders for delivery or pickup. The application features a modern, mobile-responsive design inspired by established food ordering platforms like KFC Pakistan and Domino's Pakistan, with a distinctive gold-and-black brand identity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management, caching, and data fetching

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Class Variance Authority (CVA)** for component variant management
- Custom CSS variables for theme consistency (gold/black color scheme)

**State Management Strategy**
- **Zustand** with persistence middleware for cart state management
- Local storage persistence ensures cart survives page refreshes
- React Query handles all server state (categories, menu items, orders)
- Form state managed by **React Hook Form** with Zod validation

**Design System Implementation**
- Poppins font family as primary typeface with Roboto fallback
- Mobile-first responsive design with breakpoints at 768px
- Touch-friendly minimum tap targets (48px) for mobile optimization
- Custom utility classes for elevation effects (hover-elevate, active-elevate-2)

### Backend Architecture

**Server Framework**
- **Express.js** on Node.js with TypeScript
- RESTful API design pattern for all endpoints
- Separate development and production server entry points
- Custom logging middleware for request monitoring

**Data Storage Pattern**
- **MongoDB Storage** (MongoStorage class) used when MONGO_URI is set
- **In-Memory Storage** (MemStorage class) fallback for development without database
- Implements IStorage interface for consistent API across storage backends
- Automatic storage selection based on environment variables
- Database-ready schema defined with Mongoose models

**API Structure**
- `/api/categories` - Category listing and retrieval
- `/api/menu-items` - Menu item CRUD with category filtering
- `/api/orders` - Order creation and status management
- Query parameter support for filtering (e.g., categoryId)

**Session & Request Handling**
- JSON body parsing with raw body capture for webhooks
- URL-encoded form data support
- Request timing and logging for performance monitoring

### Database Design (MongoDB)

**Schema Definition**
- **Mongoose** ORM with Zod for type-safe schema and validation
- Three main collections: categories, menuItems, orders
- MongoDB ObjectId primary keys (converted to strings for API compatibility)
- Reference relationships (menuItems.categoryId → categories._id)

**Data Model**
- **Categories**: name, slug, description, image, order (for sorting)
- **Menu Items**: name, description, price (number stored in DB), image, availability flags (boolean in DB), category reference
- **Orders**: customer details, delivery type, total amount (number in DB), status, items (JSON string), timestamp
- Order items stored as JSON string for flexibility

**Database Connection**
- MongoDB Atlas connection using MONGO_URI environment variable
- Cached connection pattern to prevent connection exhaustion in serverless-like environments
- Automatic reconnection handling in MongoStorage class
- Automatic storage backend selection in server/storage.ts

**Database Seeding**
- Comprehensive seed script at `scripts/seed-database.ts`
- Seeds 16 categories and 90 menu items
- Run with: `npx tsx scripts/seed-database.ts`
- Clears existing data before seeding for clean state

**API Contract Compatibility**
- MongoDB stores numbers and booleans natively
- Storage layer (MongoStorage) converts MongoDB documents to application format
- ObjectIds converted to strings for API responses
- Consistent API regardless of storage backend (MongoDB or in-memory)

### Build & Deployment Architecture

**Development Mode**
- Vite middleware integrated with Express server
- Hot module replacement for instant feedback
- Replit-specific plugins for enhanced development experience
- Client template reloaded from disk with cache-busting query parameters

**Production Build**
- Client built to `dist/public` using Vite
- Server bundled to `dist/index.js` using esbuild
- Static file serving from production build directory
- Fallback to index.html for SPA routing

**Module System**
- ESM (ES Modules) throughout the codebase
- TypeScript path aliases (@/, @shared/, @assets/)
- Bundler module resolution for development flexibility

## External Dependencies

### Database & ORM
- **@neondatabase/serverless** - PostgreSQL database driver optimized for serverless environments
- **Drizzle ORM** - Type-safe SQL query builder and schema management
- **connect-pg-simple** - PostgreSQL session store for Express (configured but not actively used)

### UI Component Libraries
- **Radix UI** - Comprehensive collection of unstyled, accessible component primitives
  - Dialog, Dropdown, Popover, Sheet, Toast, and 20+ other primitives
  - Provides accessible foundation for custom-styled components
- **Embla Carousel** - Touch-friendly carousel for hero sliders and category navigation
- **cmdk** - Command menu component for potential search functionality

### Form Management & Validation
- **React Hook Form** - Performant form state management with minimal re-renders
- **Zod** - Schema validation library for runtime type checking
- **@hookform/resolvers** - Integrates Zod schemas with React Hook Form

### Styling & Utilities
- **Tailwind CSS** - Utility-first CSS framework with custom configuration
- **tailwindcss-animate** - Animation utilities for Tailwind
- **class-variance-authority** - Type-safe component variants
- **clsx & tailwind-merge** - Class name manipulation utilities

### State & Data Fetching
- **TanStack Query** - Server state management with intelligent caching
- **Zustand** - Lightweight state management for cart functionality

### Development Tools
- **@replit/vite-plugin-runtime-error-modal** - Enhanced error reporting in development
- **@replit/vite-plugin-cartographer** - Development tooling for Replit environment
- **tsx** - TypeScript execution for development server
- **esbuild** - Fast JavaScript bundler for production builds

### Fonts & Assets
- **Google Fonts** - Poppins and Roboto font families loaded via CDN
- Local assets stored in `/attached_assets` directory including logo and branding guidelines

### Type Safety
- Shared TypeScript types between client and server via `/shared` directory
- Drizzle-Zod integration generates Zod schemas from database schema
- Strict TypeScript configuration with no implicit any

## Environment Variables

### Required for Production
- `MONGO_URI` or `MONGODB_URI` - MongoDB connection string (e.g., mongodb+srv://user:pass@cluster.mongodb.net/dbname)
- `ADMIN_USERNAME` - Admin dashboard login username
- `ADMIN_PASSWORD` - Admin dashboard login password

### ImageKit Integration
- `IMAGEKIT_PUBLIC_KEY` - ImageKit public key for client-side uploads
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key for server-side operations
- `IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint (e.g., https://ik.imagekit.io/your-id/)
- `VITE_IMAGEKIT_PUBLIC_KEY` - Public key exposed to frontend
- `VITE_IMAGEKIT_URL_ENDPOINT` - URL endpoint exposed to frontend

### Development Notes
- Without `MONGO_URI`, app uses in-memory storage (MemStorage) with pre-seeded data
- In-memory data resets on server restart
- Set `MONGO_URI` to enable persistent MongoDB storage

## Setup Instructions

### First-Time Setup
1. Set required environment variables (see above)
2. Install dependencies: `npm install`
3. Seed the database: `npx tsx scripts/seed-database.ts`
4. Start the application: `npm run dev`

### Re-seeding Database
To clear and repopulate the database with fresh data:
```bash
npx tsx scripts/seed-database.ts
```

This will:
- Connect to MongoDB using MONGO_URI
- Clear all existing categories and menu items
- Seed 16 categories and 90 menu items
- Disconnect cleanly