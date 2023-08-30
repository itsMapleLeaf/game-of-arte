import { useConvex, useQueries, useQuery } from "convex/react"
import {
	type FunctionReference,
	type FunctionReturnType,
	type OptionalRestArgs,
	getFunctionName,
} from "convex/server"
import isEqual from "fast-deep-equal"
import { LRUCache } from "lru-cache"
import { RequestForQueries } from "../../node_modules/.pnpm/convex@1.1.1_@clerk+clerk-react@4.24.0_react-dom@18.2.0_react@18.2.0/node_modules/convex/src/react/use_queries"
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

export function useQueriesSuspense<Queries extends RequestForQueries>(
	queries: Queries,
): { [K in keyof Queries]: FunctionReturnType<Queries[K]["query"]> } {
	const convex = useConvex()
	const results: Record<string, unknown> = {}
	const promises: Promise<void>[] = []

	for (const [key, { query, args }] of Object.entries(queries)) {
		const cacheData = getQueryCacheData(query, [args])

		if (cacheData !== undefined) {
			results[key] = cacheData
			continue
		}

		const promise = new Promise<void>((resolve) => {
			const watch = convex.watchQuery(query, args)

			const result = watch.localQueryResult()
			if (result !== undefined) {
				setQueryCacheData(query, [args], result)
				resolve()
				return
			}

			// rome-ignore lint/correctness/noUnusedVariables: false positive
			const unsubscribe = watch.onUpdate(() => {
				const result = watch.localQueryResult()
				if (result === undefined) {
					throw new Error("No query result")
				}

				setQueryCacheData(query, [args], result)
				resolve()
				unsubscribe()
			})
		})
		promises.push(promise)
	}

	if (promises.length > 0) {
		throw Promise.all(promises)
	}

	const memoQueries = useMemoValue(queries, (prev, next) => {
		const prevEntries = Object.entries(prev).map(([key, { query, args }]) => [
			key,
			{ query: getFunctionName(query), args },
		])
		const nextEntries = Object.entries(next).map(([key, { query, args }]) => [
			key,
			{ query: getFunctionName(query), args },
		])
		return isEqual(prevEntries, nextEntries)
	})

	const queryResults = useQueries(memoQueries)
	for (const [key, queryResult] of Object.entries(queryResults)) {
		if (queryResult !== undefined) {
			results[key] = queryResult
		}
	}

	return results as {
		[K in keyof Queries]: FunctionReturnType<Queries[K]["query"]>
	}
}
