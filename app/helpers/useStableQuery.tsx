import { useQuery } from "convex/react"
import type { FunctionReference, OptionalRestArgs } from "convex/server"
import { useLayoutEffect, useState } from "react"

export function useStableQuery<
	FuncRef extends FunctionReference<"query", "public">,
>(func: FuncRef, ...args: OptionalRestArgs<FuncRef>) {
	const data = useQuery(func, ...args)
	const [stableData, setStableData] = useState(data)

	// technically we can do this without an effect,
	// but forgetti refuses to update otherwise
	useLayoutEffect(() => {
		if (data !== stableData && data !== undefined) {
			setStableData(data)
		}
	}, [data, stableData])

	return stableData
}
