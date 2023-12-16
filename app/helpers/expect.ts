import { raise } from "./errors.ts"
import type { NonEmptyArray } from "./types.ts"

export function expect<T>(
	value: T,
	message = "Expected non-nullish value",
): NonNullable<T> {
	return value ?? raise(message, expect)
}

export function expectNonEmptyArray<T>(value: readonly T[]): NonEmptyArray<T> {
	if (value.length === 0) {
		throw new Error("Expected non-empty array")
	}
	return value as NonEmptyArray<T>
}
