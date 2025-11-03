import { z } from "zod";

export const idSchema = z.string().min(1, "id is required");
export const slugSchema = z
	.string()
	.min(1)
	.max(255)
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "invalid slug format");

export const paginationSchema = z.object({
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(50).default(10),
});

export const searchSchema = z.object({
	query: z.string().trim().optional(),
});




