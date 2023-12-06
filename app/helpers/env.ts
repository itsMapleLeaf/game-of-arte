import { z } from "zod"

export function parseEnv<Env extends Record<string, string>>(
	schema: z.ZodSchema<Env>,
	input: Partial<Env & Record<string, string>>,
) {
	const result = schema.safeParse(input)

	if (!result.success) {
		const errorMessage = [
			`Environment variables not defined:`,
			...result.error.issues.map((issue) => {
				const path = issue.path?.join(".")
				return `- ${path}: ${issue.message}`
			}),
		]
		throw new Error(errorMessage.join("\n"))
	}

	return result.data
}
