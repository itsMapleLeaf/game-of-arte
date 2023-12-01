import { useState } from "react"
import { useEffectEvent } from "./useEffectEvent.ts"
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect.tsx"

export function useLocalStorageState<T>(
	key: string,
	parse: (input: unknown) => T,
) {
	const [value, setValueInternal] = useState(() => parse(null))

	console.log("render")
	const init = useEffectEvent(function init() {
		console.log("init?")
		const storedValue = localStorage.getItem(key)
		setValueInternal(
			parse(storedValue === null ? null : JSON.parse(storedValue)),
		)
	})
	useIsomorphicLayoutEffect(init, [])

	const setValue = (newValue: T) => {
		setValueInternal(newValue)
		localStorage.setItem(key, JSON.stringify(newValue))
	}

	return [value, setValue] as const
}
