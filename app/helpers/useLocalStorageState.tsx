import { useEffect, useState } from "react"
import { useEffectEvent } from "./useEffectEvent.ts"

export function useLocalStorageState<T>(
	key: string,
	parse: (input: unknown) => T,
) {
	const [value, setValueInternal] = useState(() => parse(null))

	const init = useEffectEvent(function init() {
		const storedValue = localStorage.getItem(key)
		setValueInternal(
			parse(storedValue === null ? null : JSON.parse(storedValue)),
		)
	})
	useEffect(() => {
		init()
	}, [init])

	const setValue = (newValue: T) => {
		setValueInternal(newValue)
		localStorage.setItem(key, JSON.stringify(newValue))
	}

	return [value, setValue] as const
}
