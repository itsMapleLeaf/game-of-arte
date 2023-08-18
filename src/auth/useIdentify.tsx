import { useUser } from "@clerk/clerk-react"
import { api } from "convex/_generated/api"
import { useAction, useConvexAuth } from "convex/react"
import { useEffect } from "react"

export function useIdentify() {
	const auth = useConvexAuth()
	const { user } = useUser()
	const identify = useAction(api.auth.identify)

	useEffect(() => {
		if (auth.isLoading) return
		if (!auth.isAuthenticated) return
		if (!user) return
		void identify()
	}, [auth.isAuthenticated, auth.isLoading, identify, user])
}
