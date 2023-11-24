import { foldIterable } from "./iterable.ts"

export function clamp(value: number, min: number, max: number) {
	return (
		value > max ? max
		: value < min ? min
		: value
	)
}

export function sum(numbers: Iterable<number>) {
	return foldIterable(numbers, (a, b) => a + b)
}
