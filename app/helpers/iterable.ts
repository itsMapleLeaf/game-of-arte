export function* mapIterable<T, U>(
	iterable: Iterable<T>,
	mapper: (value: T) => U,
) {
	for (const value of iterable) {
		yield mapper(value)
	}
}

export function* filterIterable<T>(
	iterable: Iterable<T>,
	filter: (value: T) => boolean,
) {
	for (const value of iterable) {
		if (filter(value)) {
			yield value
		}
	}
}

export function reduceIterable<T, U>(
	iterable: Iterable<T>,
	reducer: (accumulator: U, value: T) => U,
	initialValue: U,
) {
	let accumulator = initialValue
	for (const value of iterable) {
		accumulator = reducer(accumulator, value)
	}
	return accumulator
}

export function foldIterable<T>(
	iterable: Iterable<T>,
	folder: (accumulator: T, value: T) => T,
) {
	const [first, ...rest] = iterable
	return first === undefined ? undefined : reduceIterable(rest, folder, first)
}
