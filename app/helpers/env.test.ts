import { describe, expect, it } from "vitest"
import { z } from "zod"
import { parseEnv } from "~/helpers/env"

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
