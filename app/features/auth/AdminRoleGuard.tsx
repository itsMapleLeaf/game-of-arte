import { api } from "convex/_generated/api.js"
import { useQuery } from "convex/react"

export function AdminRoleGuard({ children }: { children: React.ReactNode }) {
	const roles = useQuery(api.roles.get)
	return roles?.isAdmin ? children : null
}
