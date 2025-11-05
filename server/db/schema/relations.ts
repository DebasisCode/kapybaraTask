import { relations } from "drizzle-orm";
import { posts } from "./posts";
import { categories } from "./categories";
import { postCategories } from "./postCategories";

// Post relations: one post can have many categories
export const postsRelations = relations(posts, ({ many }) => ({
  postCategories: many(postCategories),
}));

// Category relations: one category can belong to many posts
export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));

// PostCategory relations: belongs to one post and one category
export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
}));





