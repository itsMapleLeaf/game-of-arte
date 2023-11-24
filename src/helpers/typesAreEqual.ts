import { raise } from "./errors.ts"

export type IsEqual<A, B> =
	[A] extends [B] ?
		[B] extends [A] ?
			true
		:	false
	:	false

/**
 * Checks if two types are equal. Only used for type tests; it throws at
 * runtime.
 */
export function typesAreEqual<A, B>(_isTrue: IsEqual<A, B>) {
	raise("This function is only used for type tests", typesAreEqual)
}
