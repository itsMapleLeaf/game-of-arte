import { useConvex } from "convex/react"
import { type OptionalRestArgs, type FunctionReference } from "convex/server"
import { useEffect, useState } from "react"

export function useQuerySuspense<Query extends FunctionReference<"query">>(
	query: Query,
	...args: OptionalRestArgs<Query>
) {
	const convex = useConvex()
	const watch = convex.watchQuery(query, ...args)
	const initialValue = watch.localQueryResult()

	if (initialValue === undefined) {
		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Promise<void>((resolve) => {
			const unsubscribe = watch.onUpdate(() => {
				resolve()
				unsubscribe()
			})
		})
	}

	const [value, setValue] = useState(initialValue)

	useEffect(() => {
		const updateValueFromQueryResult = () => {
			const value = watch.localQueryResult()
			if (value === undefined) throw new Error("No query result")
			setValue(value)
		}

		updateValueFromQueryResult()
		return watch.onUpdate(updateValueFromQueryResult)
	}, [watch])

	// eslint struggles with this for some reason
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return value
}
