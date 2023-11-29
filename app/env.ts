import * as v from "valibot"

const schema = v.object({
	VITE_PUBLIC_CONVEX_URL: v.string([v.minLength(1)]),
	VITE_PUBLIC_CLERK_PUBLISHABLE_KEY: v.string([v.minLength(1)]),
})

const input: Partial<v.Input<typeof schema>> = {
	VITE_PUBLIC_CONVEX_URL: import.meta.env.VITE_PUBLIC_CONVEX_URL,
	VITE_PUBLIC_CLERK_PUBLISHABLE_KEY: import.meta.env
		.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY,
}

const result = v.safeParse(schema, input)

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
