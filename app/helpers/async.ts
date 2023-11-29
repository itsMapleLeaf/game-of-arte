export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function tryUntilNonNil<T>(
	callback: () => T,
	{ timeout = 1000, period = 50 } = {},
): Promise<T> {
	const startTime = Date.now()
	let result
	do {
		result = callback()
		if (result != null) return result
		await sleep(period)
	} while (Date.now() - startTime < timeout)
	return result
}

if (import.meta.vitest) {
	const { describe, beforeEach, afterEach, expect, it, vi } = import.meta.vitest

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
}
