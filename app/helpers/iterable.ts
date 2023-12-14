import type { Truthy } from "./types.ts"

class ExtendedIterable<T> implements Iterable<T> {
	constructor(private iterable: Iterable<T>) {}

	*[Symbol.iterator]() {
		yield* this.iterable
	}

	array() {
		return [...this]
	}

	entries() {
		return this.map((value, index) => [index, value] as const)
	}

	first() {
		const iterable = this[Symbol.iterator]().next()
		return iterable.done ? undefined : iterable.value
	}

	find(predicate: BooleanConstructor): Truthy<T> | undefined
	find(predicate: (value: T) => value is T): T | undefined
	find(predicate: (value: T) => boolean): T | undefined
	find(predicate: (value: T) => boolean) {
		return this.accept(predicate).first()
	}

	promiseAll() {
		return Promise.all(this)
	}

	toMap<K, V>(fn: (value: T, index: number) => [key: K, value: V]) {
		return new Map(this.map(fn))
	}

	apply<U>(fn: (iterable: ExtendedIterable<T>) => Iterable<U>) {
		return new ExtendedIterable(fn(this))
	}

	map<U>(mapper: (value: T, index: number) => U) {
		return this.apply(function* (iterable: ExtendedIterable<T>) {
			let index = 0
			for (const value of iterable) {
				yield mapper(value, index)
				index += 1
			}
		})
	}

	// @ts-expect-error: don't know why this is yelling lol
	accept(filter: BooleanConstructor): ExtendedIterable<Truthy<T>>
	accept<U extends T>(filter: (value: T) => value is U): ExtendedIterable<U>
	accept(filter: (value: T) => boolean): ExtendedIterable<T>
	accept(filter: (value: T) => boolean): ExtendedIterable<T> {
		return this.apply(function* (iterable: ExtendedIterable<T>) {
			for (const value of iterable) {
				if (filter(value)) yield value
			}
		})
	}

	reduce<U>(reducer: (accumulator: U, value: T) => U, initialValue: U) {
		let result = initialValue
		for (const value of this) {
			result = reducer(result, value)
		}
		return result
	}

	unique() {
		return this.apply(function* (iterable: ExtendedIterable<T>) {
			const seen = new Set<T>()
			for (const value of iterable) {
				if (!seen.has(value)) {
					seen.add(value)
					yield value
				}
			}
		})
	}
}
export type { ExtendedIterable }

/** Helper to wrap an iterator with useful methods */
export function it<T>(iterable: Iterable<T>) {
	return new ExtendedIterable(iterable)
}

it.objectEntries = function objectEntries<T>(obj: Record<string, T>) {
	return it(Object.entries(obj))
}

it.factory = function factory<Args extends unknown[], Return>(
	fn: (...args: Args) => Iterable<Return>,
) {
	return (...args: Args) => new ExtendedIterable(fn(...args))
}

it.promise = {
	all: <T>(fn: () => Iterable<T | PromiseLike<T>>) => Promise.all(fn()),
}
