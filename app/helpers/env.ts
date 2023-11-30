import * as v from "valibot"

export function parseEnv<Env extends Record<string, string>>(
	schema: v.BaseSchema<Env>,
	input: Partial<Env & Record<string, string>>,
) {
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

	return result.output
}

if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest

	describe("parseEnv", () => {
		it("returns the parsed environment variables", () => {
			const schema = v.object({
				FOO: v.string([v.minLength(1)]),
				BAR: v.string([v.minLength(1)]),
			})

			const input = {
				FOO: "foo",
				BAR: "bar",
			}

			expect(parseEnv(schema, input)).toEqual(input)
		})

		it("throws an error if environment fails to parse", () => {
			const schema = v.object({
				FOO: v.string([v.minLength(1)]),
				BAR: v.string([v.minLength(1)]),
				BAZ: v.string([v.minLength(1)]),
			})

			const input = {
				FOO: "foo",
				BAR: "",
			}

			expect(() => parseEnv(schema, input)).toThrowErrorMatchingInlineSnapshot(`
				[Error: Environment variables not defined:
				- BAR: Invalid length
				- BAZ: Invalid type]
			`)
		})
	})
}
