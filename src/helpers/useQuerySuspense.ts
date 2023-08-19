import { useConvex, type WatchQueryOptions } from "convex/react"
import { type ArgsAndOptions, type FunctionReference } from "convex/server"
import { useEffect, useState } from "react"

export function useQuerySuspense<Query extends FunctionReference<"query">>(
	query: Query,
	...argsAndOptions: ArgsAndOptions<Query, WatchQueryOptions>
) {
	const convex = useConvex()
	const watch = convex.watchQuery(query, ...argsAndOptions)
	const initialValue = watch.localQueryResult()

	if (initialValue === undefined) {
		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Promise<void>((resolve) => {
			watch.onUpdate(() => {
				resolve()
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
