import { api } from "convex/_generated/api.js"
import { useAction, useConvexAuth } from "convex/react"
import { useEffect } from "react"
import { useAsyncCallback } from "../helpers/useAsyncCallback.ts"
import { LoadingPlaceholder } from "./LoadingPlaceholder.tsx"

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const auth = useConvexAuth()

	const [identify, identifyState] = useAsyncCallback(
		useAction(api.auth.identify),
	)

	useEffect(() => {
		identify()
	}, [identify])

	const error = identifyState.isError && identifyState.error
	useEffect(() => {
		if (error) console.error(error)
	}, [error])

	if (auth.isLoading || identifyState.isLoading) {
		return <LoadingPlaceholder className="fixed inset-0" />
	}

	if (identifyState.isError) {
		return (
			<p className="p-4">Identification failed. See the console for details.</p>
		)
	}

	return children
}
