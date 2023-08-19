import { useEffect } from "react"

export function useLog<T>(prefix: string, value: T): T {
	useEffect(() => {
		console.log(prefix, value)
	}, [prefix, value])
	return value
}
