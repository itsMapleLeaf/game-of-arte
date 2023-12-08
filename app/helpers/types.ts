import { raise } from "./errors.ts"

export type NonEmptyArray<T> = [T, ...T[]]

export type Falsy<T = never> = T | false | 0 | "" | null | undefined
export type Truthy<T> = Exclude<T, Falsy>

export type Spread<A extends object, B extends object> = Omit<A, keyof B> & B

export type Simplify<T> = { [K in keyof T]: T[K] } & NonNullable<unknown>

export type Nullish<T> = T | null | undefined

export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type IsNonEmpty<T extends readonly unknown[]> =
	T extends readonly [unknown, ...unknown[]] ? true
	: T extends readonly [...unknown[], unknown] ? true
	: T extends readonly [] ? false
	: false

typesAreEqual<IsNonEmpty<[number]>, true>(true)
typesAreEqual<IsNonEmpty<[number, number, number]>, true>(true)
typesAreEqual<IsNonEmpty<[number, ...number[]]>, true>(true)
typesAreEqual<IsNonEmpty<[...number[], number]>, true>(true)
typesAreEqual<IsNonEmpty<[number, ...number[], number]>, true>(true)
typesAreEqual<IsNonEmpty<[]>, false>(true)
typesAreEqual<IsNonEmpty<number[]>, false>(true)

/**
 * Returns a non-undefined item if the array is non-empty, otherwise returns
 * possibly undefined.
 */
export type SafeArrayIndex<Items extends readonly unknown[]> =
	IsNonEmpty<Items> extends true ? Items[number] : Items[number] | undefined

typesAreEqual<SafeArrayIndex<[number]>, number>(true)
typesAreEqual<SafeArrayIndex<[number, number, number]>, number>(true)
typesAreEqual<SafeArrayIndex<[number, ...number[]]>, number>(true)
typesAreEqual<SafeArrayIndex<[...number[], number]>, number>(true)
typesAreEqual<SafeArrayIndex<[number, ...number[], number]>, number>(true)
typesAreEqual<SafeArrayIndex<[]>, undefined>(true)
typesAreEqual<SafeArrayIndex<number[]>, number | undefined>(true)

/** Like {@link Omit}, but enforces that the keys are present in the type. */
export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/**
 * Returns a union of keys in every object of the union type
 *
 * @example
 * 	type Foo = { a: string } | { b: number }
 * 	type BrokenKeys = keyof Foo // never
 * 	type Keys = KeyOfUnion<Foo> // "a" | "b"
 */
export type KeyOfUnion<T> = T extends any ? keyof T : never

type KeyOfUnionTestUnion = { foo: string } | { bar: number }
interface KeyOfUnionTestInterface {
	foo: string
	bar: number
}
typesAreEqual<KeyOfUnion<KeyOfUnionTestUnion>, "foo" | "bar">(true)
typesAreEqual<KeyOfUnion<KeyOfUnionTestInterface>, "foo" | "bar">(true)

/**
 * Returns the keys of an object where the value is assignable to the test type
 *
 * @example
 * 	type Foo = { a: string; b: number; c: string }
 * 	type Keys = FilterKeysByValue<Foo, string> // "a" | "c"
 */
export type FilterKeysByValue<Object, Test> = keyof {
	[K in keyof Object as Object[K] extends Test ? K : never]: Object[K]
}

typesAreEqual<
	FilterKeysByValue<{ a: string; b: number; c: string }, string>,
	"a" | "c"
>(true)
typesAreEqual<
	FilterKeysByValue<{ a?: string; b: number; c: string }, string>,
	"a" | "c"
>(false)
typesAreEqual<
	FilterKeysByValue<{ a?: string; b: number; c: string }, string | undefined>,
	"a" | "c"
>(true)

export type Subset<T, U extends T> = T extends U ? T : never

type IsEqual<A, B> =
	[A] extends [B] ?
		[B] extends [A] ?
			true
		:	false
	:	false

/**
 * Checks if two types are equal. Only used for type tests; it throws at
 * runtime.
 */
function typesAreEqual<A, B>(_isTrue: IsEqual<A, B>) {
	raise("This function is only used for type tests", typesAreEqual)
}
