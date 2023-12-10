import { z } from "zod"
import { parseEnv } from "~/helpers/env.ts"

export const convexEnv = parseEnv(
	z.object({
		CLERK_SECRET_KEY: z.string().min(1),
		CLERK_JWT_ISSUER_DOMAIN: z.string().min(1),
		TEST: z.literal("true").optional(),
		TEST_PLAYER_USER_ID: z.string().min(1).optional(),
		TEST_WORLD_OWNER_ID: z.string().min(1).optional(),
		WEBHOOK_SECRET: z.string().min(1),
	}),
	process.env,
)
