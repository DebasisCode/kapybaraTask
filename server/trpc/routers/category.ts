import { createTRPCRouter, publicProcedure } from "@/server/trpc/init";
import { categories } from "@/server/db/schema";
import { and, eq, ilike, sql } from "drizzle-orm";
import { generateSlug } from "@/lib/utils/slug";
import {
	createCategorySchema,
	getCategoryBySlugSchema,
	listCategoriesSchema,
	updateCategorySchema,
} from "@/server/trpc/schemas/category";

export const categoryRouter = createTRPCRouter({
	list: publicProcedure
		.input(listCategoriesSchema)
		.query(async ({ ctx, input }) => {
			const { page, limit, search } = input;
			const offset = (page - 1) * limit;

			const where = search
				? ilike(categories.name, `%${search}%`)
				: undefined;

			const [items, totalResult] = await Promise.all([
				ctx.db
					.select()
					.from(categories)
					.where(where)
					.orderBy(categories.createdAt)
					.offset(offset)
					.limit(limit),
				ctx.db
					.select({ count: sql<number>`count(*)` })
					.from(categories)
					.where(where),
			]);

			const total = totalResult[0]?.count ?? 0;
			const totalPages = Math.max(1, Math.ceil(total / limit));

			return { items, total, page, limit, totalPages };
		}),

	getBySlug: publicProcedure
		.input(getCategoryBySlugSchema)
		.query(async ({ ctx, input }) => {
			const [cat] = await ctx.db
				.select()
				.from(categories)
				.where(eq(categories.slug, input.slug))
				.limit(1);
			return cat ?? null;
		}),

	create: publicProcedure
		.input(createCategorySchema)
		.mutation(async ({ ctx, input }) => {
			const baseSlug = generateSlug(input.name);

			// Ensure unique slug
			const [{ count }] = await ctx.db
				.select({ count: sql<number>`count(*)` })
				.from(categories)
				.where(
					and(
						ilike(categories.slug, `${baseSlug}%`),
					)
				);
			const uniqueSlug = count > 0 ? `${baseSlug}-${count}` : baseSlug;

			const [created] = await ctx.db
				.insert(categories)
				.values({
					name: input.name,
					slug: uniqueSlug,
					description: input.description ?? null,
				})
				.returning();
			return created;
		}),

	update: publicProcedure
		.input(updateCategorySchema)
		.mutation(async ({ ctx, input }) => {
			let slugToUse: string | undefined;
			if (input.name) {
				const baseSlug = generateSlug(input.name);
				const [{ count }] = await ctx.db
					.select({ count: sql<number>`count(*)` })
					.from(categories)
					.where(ilike(categories.slug, `${baseSlug}%`));
				slugToUse = count > 0 ? `${baseSlug}-${count}` : baseSlug;
			}

			const [updated] = await ctx.db
				.update(categories)
				.set({
					name: input.name,
					description: input.description,
					slug: slugToUse,
					updatedAt: new Date(),
				})
				.where(eq(categories.id, input.id))
				.returning();
			return updated;
		}),

	delete: publicProcedure
		.input(
			updateCategorySchema.pick({ id: true })
		)
		.mutation(async ({ ctx, input }) => {
			const [deleted] = await ctx.db
				.delete(categories)
				.where(eq(categories.id, input.id))
				.returning();
			return deleted;
		}),
});





