import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { ZodError } from "zod";
import type { CreateContextOptions } from "./types";

// Initialize tRPC with context and transformer
export const t = initTRPC.context<CreateContextOptions>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof (Object as unknown as typeof ZodError) ? (error.cause as ZodError).flatten() : null,
			},
		};
	},
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
