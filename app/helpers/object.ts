import type { Simplify } from "./types.ts"

export function splitProps<
	T extends object,
	K extends keyof T | (PropertyKey & {}),
>(obj: T, ...keys: K[]) {
	const extracted: Partial<Record<string, unknown>> = {}
	const rest: Partial<Record<string, unknown>> = {}
	const keySet = new Set<PropertyKey>(keys)

	for (const key in obj) {
		if (keySet.has(key)) {
			extracted[key] = obj[key]
		} else {
			rest[key] = obj[key]
		}
	}

	return [
		extracted as Simplify<Pick<T, Extract<K, keyof T>>>,
		rest as Simplify<Omit<T, K>>,
	] as const
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest

	describe("splitProps", () => {
		it("splits props", () => {
			const [extracted, rest] = splitProps(
				{
					a: 1,
					b: 2,
					c: 3,
				},
				"a",
				"c",
			)

			expect(extracted).toEqual({ a: 1, c: 3 })
			expect(rest).toEqual({ b: 2 })
		})
	})
}
