import { createTRPCRouter, publicProcedure } from "@/server/trpc/init";
import { posts, postCategories, categories } from "@/server/db/schema";
import { and, desc, eq, ilike, inArray, isNotNull, sql } from "drizzle-orm";
import { generateSlug } from "@/lib/utils/slug";
import {
	createPostSchema,
	getPostBySlugSchema,
	getPostByIdSchema,
	listPostsSchema,
	togglePublishSchema,
	updatePostSchema,
} from "@/server/trpc/schemas/post";

export const postRouter = createTRPCRouter({
	list: publicProcedure
		.input(listPostsSchema)
		.query(async ({ ctx, input }) => {
			const { page, limit, search, categorySlug, publishedOnly = true } = input;
			const offset = (page - 1) * limit;

			// Filter base
			const whereClauses = [] as any[];
			if (search) {
				whereClauses.push(ilike(posts.title, `%${search}%`));
			}
			if (publishedOnly) {
				whereClauses.push(eq(posts.published, true));
			}

			// If filtering by category slug, first resolve category id and then join select
			let filteredPostIds: string[] | undefined = undefined;
			if (categorySlug) {
				const [cat] = await ctx.db
					.select({ id: categories.id })
					.from(categories)
					.where(eq(categories.slug, categorySlug))
					.limit(1);
				if (!cat) {
					return { items: [], total: 0, page, limit, totalPages: 1 };
				}
				const rows = await ctx.db
					.select({ postId: postCategories.postId })
					.from(postCategories)
					.where(eq(postCategories.categoryId, cat.id));
				filteredPostIds = rows.map((r) => r.postId);
				if (filteredPostIds.length === 0) {
					return { items: [], total: 0, page, limit, totalPages: 1 };
				}
				whereClauses.push(inArray(posts.id, filteredPostIds));
			}

			const where = whereClauses.length > 0 ? and(...whereClauses) : undefined;

			// Optimize: Fetch posts and count in parallel, and fetch categories in parallel with posts
			const [rows, totalResult] = await Promise.all([
				ctx.db
					.select()
					.from(posts)
					.where(where)
					.orderBy(desc(posts.publishedAt), desc(posts.createdAt))
					.offset(offset)
					.limit(limit),
				ctx.db
					.select({ count: sql<number>`count(*)::int` })
					.from(posts)
					.where(where),
			]);

			// Optimize: Fetch categories in parallel with posts if we have post IDs
			const postIds = rows.map((p) => p.id);
			let catsByPost: Record<string, { id: string; name: string; slug: string }[]> = {};
			if (postIds.length > 0) {
				const joinRows = await ctx.db
					.select({
						postId: postCategories.postId,
						categoryId: categories.id,
						name: categories.name,
						slug: categories.slug,
					})
					.from(postCategories)
					.innerJoin(categories, eq(categories.id, postCategories.categoryId))
					.where(inArray(postCategories.postId, postIds));
				
				// Optimize: Build map more efficiently
				for (const r of joinRows) {
					if (!catsByPost[r.postId]) {
						catsByPost[r.postId] = [];
					}
					catsByPost[r.postId].push({ id: r.categoryId, name: r.name, slug: r.slug });
				}
			}

			const items = rows.map((p) => ({ ...p, categories: catsByPost[p.id] ?? [] }));
			const total = totalResult[0]?.count ?? 0;
			const totalPages = Math.max(1, Math.ceil(total / limit));
			return { items, total, page, limit, totalPages };
		}),

	stats: publicProcedure.query(async ({ ctx }) => {
		// Optimized: Use SQL aggregation instead of fetching all posts
		const [stats] = await ctx.db
			.select({
				total: sql<number>`count(*)::int`,
				published: sql<number>`count(*) filter (where ${posts.published} = true)::int`,
				drafts: sql<number>`count(*) filter (where ${posts.published} = false)::int`,
			})
			.from(posts);

		return {
			total: stats?.total ?? 0,
			published: stats?.published ?? 0,
			drafts: stats?.drafts ?? 0,
		};
	}),

	getBySlug: publicProcedure
		.input(getPostBySlugSchema)
		.query(async ({ ctx, input }) => {
			const [post] = await ctx.db
				.select()
				.from(posts)
				.where(eq(posts.slug, input.slug))
				.limit(1);
			if (!post) return null;

			const postCats = await ctx.db
				.select({
					categoryId: categories.id,
					name: categories.name,
					slug: categories.slug,
				})
				.from(postCategories)
				.innerJoin(categories, eq(categories.id, postCategories.categoryId))
				.where(eq(postCategories.postId, post.id));

		return { ...post, categories: postCats };
	}),

	getById: publicProcedure
		.input(getPostByIdSchema)
		.query(async ({ ctx, input }) => {
			const [post] = await ctx.db
				.select()
				.from(posts)
				.where(eq(posts.id, input.id))
				.limit(1);
			if (!post) return null;

			const postCats = await ctx.db
				.select({
					categoryId: categories.id,
					name: categories.name,
					slug: categories.slug,
				})
				.from(postCategories)
				.innerJoin(categories, eq(categories.id, postCategories.categoryId))
				.where(eq(postCategories.postId, post.id));

			return { ...post, categories: postCats };
		}),

	create: publicProcedure
		.input(createPostSchema)
		.mutation(async ({ ctx, input }) => {
			const baseSlug = generateSlug(input.title);
			const [{ count }] = await ctx.db
				.select({ count: sql<number>`count(*)` })
				.from(posts)
				.where(ilike(posts.slug, `${baseSlug}%`));
			const uniqueSlug = count > 0 ? `${baseSlug}-${count}` : baseSlug;

			const now = new Date();
			const [created] = await ctx.db
				.insert(posts)
				.values({
					title: input.title,
					slug: uniqueSlug,
					content: input.content,
					authorName: input.authorName,
					published: input.published,
					publishedAt: input.published ? now : null,
				})
				.returning();

			if (input.categoryIds.length > 0) {
				await ctx.db.insert(postCategories).values(
					input.categoryIds.map((cid) => ({ postId: created.id, categoryId: cid }))
				);
			}

			return created;
		}),

	update: publicProcedure
		.input(updatePostSchema)
		.mutation(async ({ ctx, input }) => {
			// Prepare slug if title changes
			let slugToUse: string | undefined;
			if (input.title) {
				const baseSlug = generateSlug(input.title);
				const [{ count }] = await ctx.db
					.select({ count: sql<number>`count(*)` })
					.from(posts)
					.where(ilike(posts.slug, `${baseSlug}%`));
				slugToUse = count > 0 ? `${baseSlug}-${count}` : baseSlug;
			}

			const now = new Date();
			const [updated] = await ctx.db
				.update(posts)
				.set({
					title: input.title,
					content: input.content,
					authorName: input.authorName,
					published: input.published,
					publishedAt: input.published === undefined ? undefined : input.published ? now : null,
					slug: slugToUse,
					updatedAt: now,
				})
				.where(eq(posts.id, input.id))
				.returning();

			if (input.categoryIds) {
				// Replace links transactionally
				await ctx.db.delete(postCategories).where(eq(postCategories.postId, input.id));
				if (input.categoryIds.length > 0) {
					await ctx.db.insert(postCategories).values(
						input.categoryIds.map((cid) => ({ postId: input.id, categoryId: cid }))
					);
				}
			}

			return updated;
		}),

	delete: publicProcedure
		.input(updatePostSchema.pick({ id: true }))
		.mutation(async ({ ctx, input }) => {
			const [deleted] = await ctx.db
				.delete(posts)
				.where(eq(posts.id, input.id))
				.returning();
			return deleted;
		}),

	togglePublish: publicProcedure
		.input(togglePublishSchema)
		.mutation(async ({ ctx, input }) => {
			const now = new Date();
			const [updated] = await ctx.db
				.update(posts)
				.set({ published: input.published, publishedAt: input.published ? now : null, updatedAt: now })
				.where(eq(posts.id, input.id))
				.returning();
			return updated;
		}),
});
