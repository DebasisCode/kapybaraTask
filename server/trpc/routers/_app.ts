import { createTRPCRouter, publicProcedure } from "@/server/trpc/init";
import { categoryRouter } from "@/server/trpc/routers/category";
import { postRouter } from "@/server/trpc/routers/post";

export const appRouter = createTRPCRouter({
	healthcheck: publicProcedure.query(() => ({ status: "ok" })),
	category: categoryRouter,
	post: postRouter,
});

export type AppRouter = typeof appRouter;
