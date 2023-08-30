import { useConvex, useQuery } from "convex/react"
import {
	type FunctionReference,
	type FunctionReturnType,
	type OptionalRestArgs,
	getFunctionName,
} from "convex/server"
import { LRUCache } from "lru-cache"

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
): FunctionReturnType<Query> {
	const convex = useConvex()
	const cacheData = getQueryCacheData(query, args)

	if (cacheData === undefined) {
		throw new Promise<void>((resolve) => {
			const watch = convex.watchQuery(query, ...args)

			const result = watch.localQueryResult()
			if (result !== undefined) {
				setQueryCacheData(query, args, result)
				resolve()
				return
			}

			// rome-ignore lint/correctness/noUnusedVariables: false positive
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

	const queryData = useQuery(query, ...args)
	return queryData === undefined ? cacheData : queryData
}
