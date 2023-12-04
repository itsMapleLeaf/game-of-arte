import type { Truthy } from "./types.ts"

class ExtendedIterable<T> implements Iterable<T> {
	constructor(private iterable: Iterable<T>) {}

	*[Symbol.iterator]() {
		yield* this.iterable
	}

	apply<U>(fn: (iterable: ExtendedIterable<T>) => Iterable<U>) {
		return new ExtendedIterable(fn(this))
	}

	map<U>(mapper: (value: T) => U) {
		return this.apply(function* (iterable: ExtendedIterable<T>) {
			for (const value of iterable) {
				yield mapper(value)
			}
		})
	}

	filter(filter: BooleanConstructor): ExtendedIterable<Truthy<T>>
	filter<U extends T>(filter: (value: T) => value is U): ExtendedIterable<U>
	filter(filter: (value: T) => boolean) {
		return this.apply(function* (iterable: ExtendedIterable<T>) {
			for (const value of iterable) {
				if (filter(value)) yield value
			}
		})
	}

	reduce<U>(reducer: (accumulator: U, value: T) => U, initialValue: U) {
		let result = initialValue
		for (const value of this.iterable) {
			result = reducer(result, value)
		}
		return result
	}

	array() {
		return [...this.iterable]
	}
}

/** Helper to wrap an iterator with useful methods */
export function it<T>(iterable: Iterable<T>) {
	return new ExtendedIterable(iterable)
}

it.factory = function factory<Args extends unknown[], Return>(
	fn: (...args: Args) => Iterable<Return>,
) {
	return (...args: Args) => new ExtendedIterable(fn(...args))
}

it.promise = {
	all: <T>(fn: () => Iterable<T | PromiseLike<T>>) => Promise.all(fn()),
}
