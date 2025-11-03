import { z } from "zod";
import { idSchema, paginationSchema, slugSchema } from "@/server/trpc/schemas/common";

export const createPostSchema = z.object({
	title: z.string().min(1).max(255),
	content: z.string().min(1), // markdown
	authorName: z.string().min(1).max(255),
	published: z.boolean().default(false),
	categoryIds: z.array(idSchema).default([]),
});

export const updatePostSchema = z.object({
	id: idSchema,
	title: z.string().min(1).max(255).optional(),
	content: z.string().min(1).optional(),
	authorName: z.string().min(1).max(255).optional(),
	published: z.boolean().optional(),
	categoryIds: z.array(idSchema).optional(),
});

export const getPostBySlugSchema = z.object({ slug: slugSchema });
export const getPostByIdSchema = z.object({ id: idSchema });

export const listPostsSchema = paginationSchema.extend({
	search: z.string().optional(),
	categorySlug: z.string().optional(),
	publishedOnly: z.boolean().default(true).optional(),
});

export const togglePublishSchema = z.object({
	id: idSchema,
	published: z.boolean(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type ListPostsInput = z.infer<typeof listPostsSchema>;
