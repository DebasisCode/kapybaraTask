import type { db } from "@/server/db";

export type CreateContextOptions = {
	// Add request-specific context fields here if needed
	db: typeof db;
};




