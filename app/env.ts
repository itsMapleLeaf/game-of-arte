import * as v from "valibot"

const envSchema = v.object({
	CONVEX_URL: v.string([v.minLength(1)]),
	CLERK_PUBLISHABLE_KEY: v.string([v.minLength(1)]),
})

const result = v.safeParse(envSchema, {
	CONVEX_URL: import.meta.env.VITE_PUBLIC_CONVEX_URL,
	CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY,
})

if (!result.success) {
	const errorMessage = [
		`Environment variables not defined:`,
		...result.issues.map((issue) => {
			const path = issue.path?.map((item) => item.key).join(".")
			return `- ${path}: ${issue.message}`
		}),
	]
	throw new Error(errorMessage.join("\n"))
}

export const env = result.output
