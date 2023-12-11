import * as z from "zod"
import { parseEnv } from "./helpers/env.ts"

const schema = z.object({
	VITE_PUBLIC_CONVEX_URL: z.string().min(1),
	VITE_CLERK_DOMAIN: z.string().min(1),
})

const input: Partial<z.input<typeof schema>> = {
	VITE_PUBLIC_CONVEX_URL: import.meta.env.VITE_PUBLIC_CONVEX_URL,
	VITE_CLERK_DOMAIN: import.meta.env.VITE_CLERK_DOMAIN,
}

export const env = parseEnv(schema, input)
