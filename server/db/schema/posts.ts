import { pgTable, text, timestamp, varchar, boolean, index } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const posts = pgTable(
  "posts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId())
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    content: text("content").notNull(), // Markdown content
    published: boolean("published").default(false).notNull(),
    authorName: varchar("author_name", { length: 255 }).notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("posts_slug_idx").on(table.slug),
    publishedIdx: index("posts_published_idx").on(table.published),
    publishedAtIdx: index("posts_published_at_idx").on(table.publishedAt),
  })
);
