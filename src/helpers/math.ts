import { reduceIterable } from "./iterable.ts"

export function clamp(value: number, min: number, max: number) {
	return (
		value > max ? max
		: value < min ? min
		: value
	)
}

export function sum(numbers: Iterable<number>) {
	return reduceIterable(numbers, (sum, value) => sum + value, 0)
}
