import type { NonEmptyArray } from "./types.ts"

export function isUrl(value: string) {
	try {
		new URL(value)
		return true
	} catch {
		return false
	}
}

export function parseNonEmptyArray<T>(value: readonly T[]): NonEmptyArray<T> {
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

export function isNonNil<T>(value: T | null | undefined): value is T {
	return value != null
}

export function compareKey<K extends PropertyKey>(key: K) {
	return function compare(a: Record<K, string>, b: Record<K, string>) {
		return a[key].localeCompare(b[key])
	}
}

export function randomItem<Items extends readonly unknown[]>(
	items: readonly [...Items],
): number extends Items["length"] ? Items[number] | undefined : Items[number] {
	return items[Math.floor(Math.random() * items.length)]
}

export function toLowerCaseTyped<T extends string>(value: T): Lowercase<T> {
	return value.toLowerCase() as Lowercase<T>
}

export function toUpperCaseTyped<T extends string>(value: T): Uppercase<T> {
	return value.toUpperCase() as Uppercase<T>
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
