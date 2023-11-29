import { createContext, useContext } from "react"
import { raise } from "./errors.ts"

const empty = Symbol("empty")

export function createSimpleContext<T>(name: string) {
	const Context = createContext<T | typeof empty>(empty)
	Context.displayName = name

	function Provider(props: { value: T; children: React.ReactNode }) {
		return (
			<Context.Provider value={props.value}>{props.children}</Context.Provider>
		)
	}

	function useValue() {
		const value = useContext(Context)
		if (value === empty) {
			raise("Missing context value", useValue)
		}
		return value
	}

	return { Provider, useValue }
}
