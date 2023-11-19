import { useRef } from "react"

const empty = Symbol()

export function useOnce<T>(init: () => T) {
	const ref = useRef<T | typeof empty>(empty)
	if (ref.current === empty) {
		ref.current = init()
	}
	return ref.current
}
