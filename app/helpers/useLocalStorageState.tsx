import { useState } from "react"

export function useLocalStorageState<T>(
	key: string,
	parse: (input: unknown) => T,
) {
	const [value, setValueInternal] = useState<T>(() => {
		const storedValue = localStorage.getItem(key)
		return parse(storedValue === null ? undefined : JSON.parse(storedValue))
	})

	const setValue = (newValue: T) => {
		setValueInternal(newValue)
		localStorage.setItem(key, JSON.stringify(newValue))
	}

	return [value, setValue] as const
}
