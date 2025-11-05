# Database Setup Guide

This guide will help you set up your PostgreSQL database for the blogging platform.

## Option 1: Using Neon (Recommended for Quick Setup)

1. Go to [Neon](https://neon.tech) and sign up for a free account
2. Create a new project
3. Copy your connection string (it will look like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)
4. Add it to your `.env.local` file as `DATABASE_URL`

## Option 2: Using Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to Settings > Database
3. Copy your connection string from the "Connection string" section
4. Make sure to use the "URI" format and add `?sslmode=require` at the end
5. Add it to your `.env.local` file as `DATABASE_URL`

## Option 3: Local PostgreSQL

If you have PostgreSQL installed locally:

1. Create a new database:
```bash
createdb blogging_platform
```

2. Add to `.env.local`:
```env
DATABASE_URL="postgresql://localhost:5432/blogging_platform"
```

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
DATABASE_URL="your-postgresql-connection-string-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important**: Never commit `.env.local` to git. It's already in `.gitignore`.

## Running Migrations

After setting up your database:

1. Generate migration files from your schema:
```bash
npm run db:generate
```

2. Push the schema to your database:
```bash
npm run db:push
```

Or use migrations (recommended for production):
```bash
npm run db:migrate
```

## Seeding the Database

After running migrations, you can seed the database with sample data:

```bash
npm run db:seed
```

## Verifying Your Setup

To verify your database connection, you can use Drizzle Studio:

```bash
npm run db:studio
```

This will open a web interface where you can browse your database tables and data.






