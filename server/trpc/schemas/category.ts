import { z } from "zod";
import { idSchema, paginationSchema, slugSchema } from "@/server/trpc/schemas/common";

export const createCategorySchema = z.object({
	name: z.string().min(1).max(255),
	description: z.string().max(10_000).optional(),
});

export const updateCategorySchema = z.object({
	id: idSchema,
	name: z.string().min(1).max(255).optional(),
	description: z.string().max(10_000).optional(),
});

export const getCategoryBySlugSchema = z.object({
	slug: slugSchema,
});

export const listCategoriesSchema = paginationSchema.extend({
	search: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ListCategoriesInput = z.infer<typeof listCategoriesSchema>;





