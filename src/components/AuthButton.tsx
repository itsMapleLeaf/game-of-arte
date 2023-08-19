import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react"
import { LucideLogIn } from "lucide-react"
import { LoadingSpinner } from "./LoadingPlaceholder"

export function AuthButton() {
	const { user, isLoaded } = useUser()
	return !isLoaded ? (
		<LoadingSpinner className="s-8" />
	) : user ? (
		<SignOutButton>
			<button className="flex items-center gap-2">
				<img src={user.imageUrl} alt="" className="rounded-full s-8" />
				<span>Sign Out</span>
			</button>
		</SignOutButton>
	) : (
		<SignInButton>
			<button className="flex items-center gap-2">
				<LucideLogIn />
				<span>Sign In</span>
			</button>
		</SignInButton>
	)
}
