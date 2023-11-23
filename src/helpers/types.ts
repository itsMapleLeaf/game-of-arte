import { typesAreEqual } from "./typesAreEqual.ts"

export type NonEmptyArray<T> = [T, ...T[]]

export type Falsy = false | 0 | "" | null | undefined

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
