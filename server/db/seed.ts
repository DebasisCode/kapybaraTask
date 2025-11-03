import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { db } from "./index";
import { posts, categories, postCategories } from "./schema";
import { generateSlug } from "@/lib/utils/slug";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data (for development only)
    console.log("🧹 Clearing existing data...");
    await db.delete(postCategories);
    await db.delete(posts);
    await db.delete(categories);

    // Seed Categories
    console.log("📁 Creating categories...");
    const designCategory = await db
      .insert(categories)
      .values({
        name: "Design",
        slug: generateSlug("Design"),
        description: "Posts about design principles, UI/UX, and visual design",
      })
      .returning();

    const researchCategory = await db
      .insert(categories)
      .values({
        name: "Research",
        slug: generateSlug("Research"),
        description: "Research findings, case studies, and analysis",
      })
      .returning();

    const softwareCategory = await db
      .insert(categories)
      .values({
        name: "Software",
        slug: generateSlug("Software"),
        description: "Software development, tools, and best practices",
      })
      .returning();

    const programmingCategory = await db
      .insert(categories)
      .values({
        name: "Programming",
        slug: generateSlug("Programming"),
        description: "Programming tutorials, tips, and guides",
      })
      .returning();

    const allCategories = [
      designCategory[0],
      researchCategory[0],
      softwareCategory[0],
      programmingCategory[0],
    ];

    console.log(`✅ Created ${allCategories.length} categories`);

    // Seed Posts
    console.log("📝 Creating posts...");

    const post1 = await db
      .insert(posts)
      .values({
        title: "Migrating to Linear 101",
        slug: generateSlug("Migrating to Linear 101"),
        content: `Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how we successfully migrated our entire team.

## Getting Started

The migration process was smoother than expected. Linear's intuitive interface made it easy for our team to adopt.

### Key Features

- **Fast performance**: No lag when switching between issues
- **Command palette**: Quick navigation with keyboard shortcuts
- **Integrated workflows**: Connect with your existing tools

## Migration Steps

1. Export data from your current tool
2. Import into Linear
3. Set up team workflows
4. Train your team

The entire process took us less than a week, and our productivity increased by 30%.`,
        published: true,
        authorName: "Phoenix Baker",
        publishedAt: new Date("2025-01-19"),
      })
      .returning();

    const post2 = await db
      .insert(posts)
      .values({
        title: "UX review presentations",
        slug: generateSlug("UX review presentations"),
        content: `How do you create compelling presentations that wow your colleagues and impress your managers?

## Best Practices

### Structure Your Story

Every great presentation tells a story. Start with the problem, present the solution, and end with results.

### Use Visuals

- Screenshots of the current state
- Mockups of the proposed solution
- Before/after comparisons
- User journey maps

### Engage Your Audience

Ask questions, tell stories, and make it interactive. Remember, you're not just presenting data—you're sharing insights.

## Common Mistakes

Avoid these pitfalls:
- Too much text on slides
- Reading directly from slides
- Not practicing beforehand
- Ignoring audience feedback

With these tips, your next UX review will be a success!`,
        published: true,
        authorName: "Olivia Rhye",
        publishedAt: new Date("2025-01-18"),
      })
      .returning();

    const post3 = await db
      .insert(posts)
      .values({
        title: "Building with React and Next.js",
        slug: generateSlug("Building with React and Next.js"),
        content: `React and Next.js have become the go-to stack for modern web applications. Here's why and how to get started.

## Why Next.js?

Next.js builds on top of React, adding powerful features like:
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- Built-in optimization

## Getting Started

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Best Practices

1. Use the App Router for new projects
2. Leverage server components when possible
3. Optimize images with next/image
4. Use TypeScript for type safety

Start building amazing experiences today!`,
        published: true,
        authorName: "Alex Morgan",
        publishedAt: new Date("2025-01-17"),
      })
      .returning();

    const post4 = await db
      .insert(posts)
      .values({
        title: "The Future of Web Development",
        slug: generateSlug("The Future of Web Development"),
        content: `Web development is evolving rapidly. Let's explore what's coming next.

## Emerging Trends

- **AI-powered development**: Tools that write code for you
- **Edge computing**: Bringing computation closer to users
- **WebAssembly**: Near-native performance in the browser

## What to Learn

Stay ahead by learning:
- Modern frameworks (Next.js, Remix, SvelteKit)
- TypeScript
- GraphQL and tRPC
- Testing strategies

The future is bright for developers who adapt and learn continuously.`,
        published: false,
        authorName: "Phoenix Baker",
        publishedAt: null,
      })
      .returning();

    const allPosts = [post1[0], post2[0], post3[0], post4[0]];

    console.log(`✅ Created ${allPosts.length} posts`);

    // Link Posts to Categories
    console.log("🔗 Linking posts to categories...");

    // Post 1: Design, Software
    await db.insert(postCategories).values({
      postId: post1[0].id,
      categoryId: designCategory[0].id,
    });
    await db.insert(postCategories).values({
      postId: post1[0].id,
      categoryId: softwareCategory[0].id,
    });

    // Post 2: Design, Research
    await db.insert(postCategories).values({
      postId: post2[0].id,
      categoryId: designCategory[0].id,
    });
    await db.insert(postCategories).values({
      postId: post2[0].id,
      categoryId: researchCategory[0].id,
    });

    // Post 3: Software, Programming
    await db.insert(postCategories).values({
      postId: post3[0].id,
      categoryId: softwareCategory[0].id,
    });
    await db.insert(postCategories).values({
      postId: post3[0].id,
      categoryId: programmingCategory[0].id,
    });

    // Post 4: Software, Research
    await db.insert(postCategories).values({
      postId: post4[0].id,
      categoryId: softwareCategory[0].id,
    });
    await db.insert(postCategories).values({
      postId: post4[0].id,
      categoryId: researchCategory[0].id,
    });

    console.log("✅ Linked posts to categories");

    console.log("🎉 Database seed completed successfully!");
    console.log(`   - ${allCategories.length} categories created`);
    console.log(`   - ${allPosts.length} posts created`);
    console.log(`   - ${allPosts.length} post-category relationships created`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("✅ Seed script finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  });