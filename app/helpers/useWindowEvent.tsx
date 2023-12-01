import { useEffect } from "react"

export function useWindowEvent<T extends keyof WindowEventMap>(
	event: T,
	listener: (event: WindowEventMap[T]) => void,
	options?: boolean | AddEventListenerOptions,
) {
	useEffect(() => {
		window.addEventListener(event, listener, options)
		return () => {
			window.removeEventListener(event, listener, options)
		}
	}, [event, listener, options])
}
