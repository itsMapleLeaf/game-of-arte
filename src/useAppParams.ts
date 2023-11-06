import type { Id } from "convex/_generated/dataModel.js"
import type { ReactNode } from "react"
import { useParam } from "./helpers/useParam.ts"

export function useAppParams() {
	return {
		characterId: useParam("character").withParser(
			(value) => value as Id<"characters">,
		),
		tab: useParam("tab"),
	}
}

export function AppParams({
	children,
}: {
	children: (params: ReturnType<typeof useAppParams>) => ReactNode
}) {
	return children(useAppParams())
}
