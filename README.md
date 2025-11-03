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

### ✅ Priority 1 (Must-Haves) - Completed
- ✅ Blog post CRUD operations (Create, Read, Update, Delete)
- ✅ Category CRUD operations
- ✅ Assign one or more categories to posts
- ✅ Blog listing page with all posts
- ✅ Individual post view page with full content
- ✅ Category filtering on blog listing page
- ✅ Responsive navigation with mobile menu

### ✅ Priority 2 (Should-Haves) - Completed
- ✅ Landing page with Hero, Features, and CTA sections
- ✅ Dashboard page for managing all posts
- ✅ Draft/Published status for posts with toggle functionality
- ✅ Loading states (skeletons) and error handling
- ✅ Full mobile-responsive design
- ✅ Markdown content editor with live preview

### ⏳ Priority 3 (Nice-to-Haves) - Partial
- ⏳ Search functionality (not implemented)
- ⏳ Post statistics (word count, reading time) (not implemented)
- ⏳ Dark mode (not implemented)
- ⏳ Image uploads (not implemented)
- ⏳ Post preview functionality (not implemented)
- ✅ Pagination (implemented on blog listing)
- ✅ SEO meta tags (implemented)

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

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub.

2. Import your repository to Vercel.

3. Set environment variables in Vercel:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

4. Deploy! Vercel will automatically:
   - Detect Next.js
   - Install dependencies
   - Build the application
   - Deploy to production

### Database Setup for Production

After deployment, run migrations on your production database:

```bash
npm run db:migrate
```

Or push schema directly (for development/staging):

```bash
npm run db:push
```

## 📊 Database Schema

### Posts Table
- `id` (text, CUID2) - Primary key
- `title` (varchar 255) - Post title
- `slug` (varchar 255, unique, indexed) - URL-friendly slug
- `content` (text) - Markdown content
- `published` (boolean, default false, indexed) - Publication status
- `author_name` (varchar 255) - Author name
- `published_at` (timestamp, nullable, indexed) - Publication date
- `created_at` (timestamp) - Creation date
- `updated_at` (timestamp) - Last update date

### Categories Table
- `id` (text, CUID2) - Primary key
- `name` (varchar 255, unique) - Category name
- `slug` (varchar 255, unique, indexed) - URL-friendly slug
- `description` (text, nullable) - Category description
- `created_at` (timestamp) - Creation date
- `updated_at` (timestamp) - Last update date

### Post Categories Table (Junction)
- `post_id` (text) - Foreign key to posts
- `category_id` (text) - Foreign key to categories
- Composite primary key (post_id, category_id)
- Cascade delete on post/category deletion

## 🤝 Design Decisions & Trade-offs

### Why tRPC?
- **Type Safety**: End-to-end type inference eliminates runtime API errors
- **Developer Experience**: Auto-completion in IDE, no manual API typing
- **Performance**: No code generation needed, types are inferred at compile time
- **Trade-off**: Requires TypeScript, but this project uses TypeScript anyway

### Why Drizzle ORM?
- **Type Safety**: TypeScript-first ORM with excellent type inference
- **SQL-like**: Feels familiar if you know SQL
- **Lightweight**: No heavy abstractions
- **Migration Control**: Full control over migrations
- **Trade-off**: Slightly more verbose than Prisma for simple queries

### Why Zustand for UI State?
- **Minimal**: Only used where React Query isn't appropriate (modals, sidebars)
- **Simple API**: Easier than Redux for simple state
- **Small Bundle**: Very lightweight
- **Trade-off**: Most state is in React Query, so Zustand is barely used

### Why Markdown Editor?
- **Fast Implementation**: Faster than rich text editor (as suggested in requirements)
- **Simple**: Easy to store and render
- **Flexible**: Markdown is powerful and extensible
- **Trade-off**: Less user-friendly than WYSIWYG, but acceptable for technical users

### Component Organization
- Components segregated by feature/use case (as per user preference)
- Reusable buttons in separate folders by use case
- Clean separation of concerns

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` is set correctly in `.env.local`
- Check that your password is URL-encoded if it contains special characters
- For Supabase, use Session Pooler if you see IPv4 compatibility warnings
- Verify database is accessible from your network

### Seed Script Not Working
- The seed script loads `.env.local` automatically
- Make sure `DATABASE_URL` is in `.env.local` (not just `.env`)
- Check database connection is valid

### Type Errors
- Run `npm run type-check` to see all TypeScript errors
- Ensure all dependencies are installed: `npm install`
- Clear `.next` folder and rebuild if types seem stale

## 📄 License

MIT

## 🙏 Acknowledgments

Built as an assessment project demonstrating modern full-stack development practices.
