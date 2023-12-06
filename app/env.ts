import * as z from "zod"
import { parseEnv } from "./helpers/env.ts"

const schema = z.object({
	VITE_PUBLIC_CONVEX_URL: z.string().min(1),
})

const input: Partial<v.Input<typeof schema>> = {
	VITE_PUBLIC_CONVEX_URL: import.meta.env.VITE_PUBLIC_CONVEX_URL,
}

export const env = parseEnv(schema, input)
