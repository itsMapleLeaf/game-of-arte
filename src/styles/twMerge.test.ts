import { describe, expect, it } from "vitest"
import { twMerge } from "./twMerge.ts"

describe("custom twMerge", () => {
	it("handles fluid-cols", () => {
		expect(
			twMerge(
				"grid-cols-12 fluid-cols-auto-fill fluid-cols-auto-fit fluid-cols-12 fluid-cols-6",
			),
		).toBe("fluid-cols-auto-fit fluid-cols-6")
	})
})
