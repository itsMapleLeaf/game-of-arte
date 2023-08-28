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

export function toFiniteNumberOrUndefined(input: unknown): number | undefined {
	if (input === "") return undefined
	const number = Number(input)
	return Number.isFinite(number) ? number : undefined
}

export function clamp(value: number, min: number, max: number) {
	return value > max ? max : value < min ? min : value
}

export function compareKey<K extends PropertyKey>(key: K) {
	return function compare(a: Record<K, string>, b: Record<K, string>) {
		return a[key].localeCompare(b[key])
	}
}
