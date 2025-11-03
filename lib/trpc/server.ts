import { appRouter, type AppRouter } from "@/server/trpc/routers/_app";
import { createTRPCContext } from "@/server/trpc/context";

export async function createCaller() {
	const ctx = await createTRPCContext();
	return appRouter.createCaller(ctx);
}

export type { AppRouter };
