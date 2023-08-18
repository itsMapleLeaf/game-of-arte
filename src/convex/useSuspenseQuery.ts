import { type WatchQueryOptions } from "convex/react"
import { type ArgsAndOptions, type FunctionReference } from "convex/server"
import { useEffect, useState } from "react"
import { raise } from "~/helpers/errors"
import { convex } from "./convex"

export function useQuerySuspense<Query extends FunctionReference<"query">>(
	query: Query,
	...argsAndOptions: ArgsAndOptions<Query, WatchQueryOptions>
) {
	const watch = convex.watchQuery(query, ...argsAndOptions)
	const initialValue = watch.localQueryResult()

	if (!initialValue) {
		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Promise<void>((resolve) => {
			watch.onUpdate(() => {
				resolve()
			})
		})
	}

	const [value, setValue] = useState(initialValue)

	useEffect(() => {
		return watch.onUpdate(() => {
			const value = watch.localQueryResult() ?? raise("No query result")
			setValue(value)
		})
	}, [watch])

	// eslint struggles with this for some reason
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return value
}
