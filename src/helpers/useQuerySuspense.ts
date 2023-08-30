import { useConvex } from "convex/react"
import {
	type FunctionReference,
	type FunctionReturnType,
	type OptionalRestArgs,
	getFunctionName,
} from "convex/server"
import { LRUCache } from "lru-cache"
import { useEffect, useLayoutEffect, useState } from "react"
import { useMemoValue } from "./useMemoValue.ts"

const cache = new LRUCache<string, NonNullable<unknown>>({
	max: 100,
})

function getCacheKey(
	query: FunctionReference<"query">,
	args: [args?: Record<string, unknown>],
) {
	return JSON.stringify([getFunctionName(query), args])
}

function getQueryCacheData<Query extends FunctionReference<"query">>(
	query: Query,
	args: OptionalRestArgs<Query>,
) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return cache.get(getCacheKey(query, args)) as
		| FunctionReturnType<Query>
		| undefined
}

function setQueryCacheData<Query extends FunctionReference<"query">>(
	query: Query,
	args: OptionalRestArgs<Query>,
	data: FunctionReturnType<Query>,
) {
	cache.set(getCacheKey(query, args), data)
}

export function useQuerySuspense<Query extends FunctionReference<"query">>(
	query: Query,
	...args: OptionalRestArgs<Query>
) {
	const convex = useConvex()
	const cacheData = getQueryCacheData(query, args)

	if (cacheData === undefined) {
		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		throw new Promise<void>((resolve) => {
			const watch = convex.watchQuery(query, ...args)

			const result = watch.localQueryResult()
			if (result !== undefined) {
				setQueryCacheData(query, args, result)
				resolve()
				return
			}

			const unsubscribe = watch.onUpdate(() => {
				const result = watch.localQueryResult()
				if (result === undefined) {
					throw new Error("No query result")
				}

				setQueryCacheData(query, args, result)
				resolve()
				unsubscribe()
			})
		})
	}

	const [data, setData] = useState(cacheData)

	const memoQuery = useMemoValue(
		query,
		(a, b) => getFunctionName(a) === getFunctionName(b),
	)

	const memoArgs = useMemoValue(args)

	useEffect(() => {
		const data = getQueryCacheData(memoQuery, memoArgs)
		if (data !== undefined) setData(data)
	}, [memoArgs, memoQuery])

	useLayoutEffect(() => {
		const watch = convex.watchQuery(memoQuery, ...memoArgs)
		return watch.onUpdate(() => {
			const result = watch.localQueryResult()
			if (result === undefined) {
				throw new Error("No query result")
			}
			setData(result)
			setQueryCacheData(memoQuery, memoArgs, result)
		})
	}, [convex, memoQuery, memoArgs])

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return data
}
