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

if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest

	describe("parseEnv", () => {
		it("returns the parsed environment variables", () => {
			const schema = z.object({
				FOO: z.string().min(1),
				BAR: z.string().min(1),
			})

			const input = {
				FOO: "foo",
				BAR: "bar",
			}

			expect(parseEnv(schema, input)).toEqual(input)
		})

		it("throws an error if environment fails to parse", () => {
			const schema = z.object({
				FOO: z.string().min(1),
				BAR: z.string().min(1),
				BAZ: z.string().min(1),
			})

			const input = {
				FOO: "foo",
				BAR: "",
			}

			expect(() => parseEnv(schema, input)).toThrowError(/BAR[\s\S]+BAZ/)
		})
	})
}
