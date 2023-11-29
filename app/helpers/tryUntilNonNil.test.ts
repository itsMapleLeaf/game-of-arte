import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { tryUntilNonNil } from "./tryUntilNonNil.ts"

describe("tryUntilNonNil", () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it("should return the first non-nil value", async () => {
		let i = 0
		const result = tryUntilNonNil(
			() => {
				i++
				return i === 3 ? i : undefined
			},
			{
				period: 0,
			},
		)

		await vi.runAllTimersAsync()

		expect(await result).toBe(3)
		expect(i).toBe(3)
	})

	it("always runs at least once", async () => {
		const func = vi.fn(() => 1)

		const result = tryUntilNonNil(func, {
			period: 0,
			timeout: 0,
		})

		await vi.runAllTimersAsync()

		expect(await result).toBe(1)
		expect(func).toHaveBeenCalledTimes(1)
	})

	it("accepts a custom timeout and period", async () => {
		const func = vi.fn(() => undefined)

		const result = tryUntilNonNil(func, {
			period: 500,
			timeout: 2100,
		})

		await vi.runAllTimersAsync()
		await result

		expect(func).toHaveBeenCalledTimes(5)
	})

	it("should preserve the nil return type", async () => {
		const undefinedResult = tryUntilNonNil(() => undefined)
		const nullResult = tryUntilNonNil(() => null)
		await vi.runAllTimersAsync()
		expect(await undefinedResult).toBe(undefined)
		expect(await nullResult).toBe(null)
	})
})
