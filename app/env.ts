import * as v from "valibot"
import { parseEnv } from "./helpers/env.ts"

const schema = v.object({
	VITE_PUBLIC_CONVEX_URL: v.string([v.minLength(1)]),
})

const input: Partial<v.Input<typeof schema>> = {
	VITE_PUBLIC_CONVEX_URL: import.meta.env.VITE_PUBLIC_CONVEX_URL,
}

export const env = parseEnv(schema, input)
