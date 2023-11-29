import { raise } from "./errors.ts"
import type { NonEmptyArray } from "./types.ts"

export function expect<T>(value: T): NonNullable<T> {
	return value ?? raise("Expected non-nullish value", expect)
}

export function expectNonEmptyArray<T>(value: readonly T[]): NonEmptyArray<T> {
	if (value.length === 0) {
		throw new Error("Expected non-empty array")
	}
	return value as NonEmptyArray<T>
}
