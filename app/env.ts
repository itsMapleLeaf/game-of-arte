import * as v from "valibot"
import { parseEnv } from "./helpers/env.ts"

const schema = v.object({
	VITE_PUBLIC_CONVEX_URL: v.string([v.minLength(1)]),
	VITE_PUBLIC_CLERK_PUBLISHABLE_KEY: v.string([v.minLength(1)]),
})

const input: Partial<v.Input<typeof schema>> = {
	VITE_PUBLIC_CONVEX_URL: import.meta.env.VITE_PUBLIC_CONVEX_URL,
	VITE_PUBLIC_CLERK_PUBLISHABLE_KEY: import.meta.env
		.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY,
}

export const env = parseEnv(schema, input)
