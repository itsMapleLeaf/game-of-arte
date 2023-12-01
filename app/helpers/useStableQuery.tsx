import { useQuery } from "convex/react"
import type { FunctionReference, OptionalRestArgs } from "convex/server"
import { useRef } from "react"

/* @forgetti skip */
export function useStableQuery<
	FuncRef extends FunctionReference<"query", "public">,
>(func: FuncRef, ...args: OptionalRestArgs<FuncRef>) {
	const data = useQuery(func, ...args)
	const ref = useRef(data)
	if (data !== undefined) {
		ref.current = data
	}
	return ref.current
}
