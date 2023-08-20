import { type NonEmptyArray } from "./types.ts"

export function isUrl(value: string) {
	try {
		new URL(value)
		return true
	} catch {
		return false
	}
}

export function parseNonEmptyArray<T>(value: T[]): NonEmptyArray<T> {
	if (value.length === 0) {
		throw new Error("Expected non-empty array")
	}
	return value as NonEmptyArray<T>
}
