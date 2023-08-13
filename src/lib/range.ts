type RangeArgs = [length: number] | [start: number, end: number, step?: number]

export function range(...args: RangeArgs): number[] {
	let start, end, step
	if (args.length === 1) {
		start = 0
		end = args[0]
		step = 1
	} else {
		start = args[0]
		end = args[1]
		step = args[2] ?? 1
	}

	const result = []
	for (let i = start; i < end; i += step) {
		result.push(i)
	}
	return result
}

export function rangeInclusive(start: number, end: number): number[] {
	return range(start, end + 1)
}
