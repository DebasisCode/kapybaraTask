# Multi-User Blogging Platform

A modern full-stack blogging platform built with Next.js 15, tRPC, PostgreSQL, and Drizzle ORM. This project demonstrates a complete CRUD application with type-safe APIs, modern React patterns, and a clean, professional UI.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Neon/Supabase recommended)
- **ORM**: Drizzle ORM
- **API**: tRPC (end-to-end type safety)
- **Validation**: Zod
- **Data Fetching**: React Query (via tRPC integration)
- **State Management**: Zustand (for UI state only)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Content**: Markdown with react-markdown

## ✨ Features

### 📝 Blog Post Management
- **Create and Edit Posts**: Write blog posts using a Markdown editor with live preview functionality
- **Draft System**: Save posts as drafts and publish them when ready with a simple toggle
- **Category Organization**: Assign one or more categories to each post for better organization
- **Full Content Management**: Complete CRUD operations - create, read, update, and delete posts
- **Dashboard View**: Centralized dashboard to view and manage all your posts in one place

### 🏷️ Category Management
- **Flexible Categories**: Create, update, and delete categories to organize your content
- **Category Filtering**: Browse posts by category on the blog listing page
- **Unique Slugs**: Categories automatically generate URL-friendly slugs

### 📖 Blog Browsing Experience
- **Post Listing**: Browse all published posts on a dedicated blog listing page
- **Individual Post Views**: Read full post content on dedicated post pages
- **Category Navigation**: Filter posts by category to find content that interests you
- **Pagination**: Navigate through posts with paginated listing
- **SEO Optimized**: All pages include proper meta tags, Open Graph tags, and Twitter Cards for better search engine visibility and social sharing

### 🎨 User Interface & Design
- **Modern Landing Page**: Welcome visitors with a professional landing page featuring Hero, Features, and Call-to-Action sections
- **Responsive Design**: Fully mobile-responsive interface that works seamlessly on all devices
- **Mobile Navigation**: Touch-friendly mobile menu for easy navigation on smartphones and tablets
- **Loading States**: Smooth loading skeletons while content is being fetched
- **Error Handling**: User-friendly error messages with retry functionality for graceful error recovery

### 🔄 Planned Features
The following features are planned for future releases:
- Search functionality to find posts by keywords
- Post statistics including word count and estimated reading time
- Dark mode for comfortable viewing in low-light environments
- Image uploads for richer content
- Post preview functionality before publishing

## 📋 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for quick setup)

### Installation

1. **Clone the repository and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Note**: If your password contains special characters (like `@`), URL-encode them. For example, `@` becomes `%40`.

3. **Generate and run database migrations:**

```bash
npm run db:generate
npm run db:push
```

4. **Seed the database with sample data (optional):**

```bash
npm run db:seed
```

This will create 4 sample categories and 4 sample posts with relationships.

5. **Start the development server:**

```bash
npm run dev:test
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   └── trpc/            # tRPC API handler
│   ├── blog/                # Blog pages
│   │   ├── [slug]/          # Individual post pages
│   │   └── page.tsx         # Blog listing page
│   ├── posts/               # Post management pages
│   │   ├── new/             # Create new post
│   │   └── [id]/edit/       # Edit post
│   ├── categories/          # Category management page
│   ├── dashboard/           # Dashboard page
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── blog/                # Blog-specific components
│   │   ├── PostCard.tsx     # Blog post card
│   │   ├── Pagination.tsx   # Pagination controls
│   │   └── CategoryFilter.tsx
│   ├── categories/          # Category management components
│   ├── dashboard/           # Dashboard components
│   ├── editor/              # Editor components
│   ├── forms/               # Form components
│   ├── landing/             # Landing page components
│   ├── layout/              # Layout components (Header, Footer, Container)
│   └── ui/                  # Reusable UI components (LoadingSkeleton, ErrorMessage)
├── lib/                     # Shared utilities
│   ├── trpc/                # tRPC client/server setup
│   │   ├── client.tsx       # React client with providers
│   │   └── server.ts        # Server-side caller
│   ├── store/               # Zustand stores
│   ├── utils/               # Utility functions
│   │   ├── slug.ts          # Slug generation
│   │   └── metadata.ts      # SEO metadata helpers
│   └── types.ts             # Shared TypeScript types
├── server/                  # Backend code
│   ├── db/                  # Database setup
│   │   ├── index.ts         # Database connection
│   │   ├── schema/          # Drizzle schema definitions
│   │   │   ├── categories.ts
│   │   │   ├── posts.ts
│   │   │   ├── postCategories.ts
│   │   │   ├── relations.ts
│   │   │   └── index.ts
│   │   └── seed.ts          # Database seed script
│   └── trpc/                # tRPC setup
│       ├── init.ts          # tRPC initialization
│       ├── context.ts       # tRPC context
│       ├── routers/         # tRPC routers
│       │   ├── _app.ts      # Root router
│       │   ├── category.ts  # Category router
│       │   └── post.ts     # Post router
│       └── schemas/         # Zod validation schemas
│           ├── common.ts    # Shared schemas
│           ├── category.ts  # Category schemas
│           └── post.ts      # Post schemas
└── drizzle/                 # Generated migration files
```

## 🔧 Database Scripts

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes directly to database (dev only)
- `npm run db:studio` - Open Drizzle Studio for database browsing
- `npm run db:seed` - Seed the database with sample data

## 🗂️ tRPC Router Structure

The tRPC API is organized into nested routers:

### Root Router (`server/trpc/routers/_app.ts`)
```typescript
appRouter = {
  healthcheck: query,        // Health check endpoint
  category: categoryRouter,   // Category operations
  post: postRouter,          // Post operations
}
```

### Category Router (`server/trpc/routers/category.ts`)
- `list` - List all categories with pagination and search
- `getBySlug` - Get a single category by slug
- `create` - Create a new category (auto-generates slug)
- `update` - Update an existing category
- `delete` - Delete a category

### Post Router (`server/trpc/routers/post.ts`)
- `list` - List posts with filtering, pagination, and category filtering
- `getBySlug` - Get a single post by slug with categories
- `getById` - Get a single post by ID (for editing)
- `create` - Create a new post with categories
- `update` - Update an existing post and its categories
- `delete` - Delete a post
- `togglePublish` - Toggle publish/unpublish status

All procedures use Zod schemas for input validation and return type-safe results.

## 🎯 Key Features & Implementation Details

### Optimistic Updates
All mutations implement optimistic updates for instant UI feedback:
- Post create/update/delete
- Category create/update/delete
- Post publish/unpublish toggle

On error, the UI automatically rolls back to the previous state.

### Type Safety
- Full end-to-end type safety with tRPC
- Type inference from database schema to API to frontend
- Zod validation on all inputs
- Minimal use of `any` type

### Error Handling
- Consistent error messages across the application
- User-friendly error components with retry functionality
- Graceful error recovery
- Zod error formatting in tRPC responses

### Mobile Responsiveness
- Mobile-first design approach
- Responsive grid layouts
- Mobile navigation menu
- Table scrolling on small screens
- Touch-friendly buttons and inputs

### SEO Optimization
- Dynamic metadata generation for all pages
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs
- Article metadata for blog posts

## 🔄 State Management Strategy

- **Server State**: Managed by React Query (via tRPC hooks)
- **UI State**: Minimal Zustand store for UI-specific state (sidebar, modals)
- **URL State**: Query parameters for filters, pagination
- **Form State**: React local state with tRPC mutations

## 📝 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `NEXT_PUBLIC_APP_URL` | Application URL for absolute links | No | `http://localhost:3000` |

## 🛠️ Development

- `npm run dev:test` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking