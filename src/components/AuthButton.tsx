import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react"
import { LucideLogIn } from "lucide-react"
import { LoadingSpinner } from "./LoadingPlaceholder.tsx"

export function AuthButton() {
	const { user, isLoaded } = useUser()

	if (!isLoaded) {
		return <LoadingSpinner className="s-8" />
	}

	if (!user) {
		return (
			<SignInButton>
				<button type="button" className="flex items-center gap-2">
					<LucideLogIn />
					<span>Sign In</span>
				</button>
			</SignInButton>
		)
	}

	return (
		<SignOutButton>
			<button type="button" className="flex items-center gap-2">
				<img src={user.imageUrl} alt="" className="rounded-full s-8" />
				<span>Sign Out</span>
			</button>
		</SignOutButton>
	)
}
