import isDeepEqual from "fast-deep-equal"
import { useRef } from "react"

const empty = Symbol()

export function useMemoValue<T>(
	value: T,
	isEqual: (prev: T, next: T) => unknown = isDeepEqual,
): T {
	const ref = useRef<typeof empty | T>(empty)
	if (ref.current === empty || !isEqual(value, ref.current)) {
		ref.current = value
	}
	return ref.current
}
