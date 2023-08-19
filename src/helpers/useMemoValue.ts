import isDeepEqual from "fast-deep-equal"
import { useRef } from "react"

export function useMemoValue<T>(
	value: T,
	isEqual: (prev: T, next: T) => unknown = isDeepEqual,
): T {
	const ref = useRef(value)
	if (!isEqual(value, ref.current)) {
		ref.current = value
	}
	return ref.current
}
