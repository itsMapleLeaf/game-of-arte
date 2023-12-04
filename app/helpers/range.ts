import { it } from "./iterable.ts"

type RangeArgs = [length: number] | [start: number, end: number, step?: number]

export const range = it.factory(function* range(
	...args: RangeArgs
): Generator<number> {
	const { start, end, step } = parseRangeArgs(args)
	for (let i = start; i < end; i += step) {
		yield i
	}
})

export const rangeInclusive = it.factory(function* rangeInclusive(
	...args: RangeArgs
) {
	const { start, end, step } = parseRangeArgs(args)
	yield* range(start, end + step, step)
})

function parseRangeArgs(args: RangeArgs) {
	let start
	let end
	let step
	if (args.length === 1) {
		start = 0
		end = args[0]
		step = 1
	} else {
		start = args[0]
		end = args[1]
		step = args[2] ?? 1
	}
	return { start, end, step }
}
