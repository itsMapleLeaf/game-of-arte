import { createBrowserHistory } from "history"
import { useEffect, useState } from "react"

const history = createBrowserHistory()

export function useParam(name: string) {
	const [location, setLocation] = useState(history.location)

	useEffect(() => {
		return history.listen((update) => {
			setLocation(update.location)
		})
	}, [])

	const current = new URLSearchParams(location.search).get(name)

	const link = (value: string) => {
		const params = new URLSearchParams(location.search)
		params.set(name, value)
		return `?${params.toString()}`
	}

	const push = (value: string) => {
		history.push(link(value))
	}

	const replace = (value: string) => {
		history.replace(link(value))
	}

	const api = { current, push, replace, link }
	return {
		...api,
		withParser: <T>(parse: (value: string) => T) => ({
			...api,
			current: current ? parse(current) : null,
		}),
	}
}
