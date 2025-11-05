import { db } from "@/server/db";
import type { CreateContextOptions } from "./types";

export async function createTRPCContext(): Promise<CreateContextOptions> {
	return {
		db,
	};
}






