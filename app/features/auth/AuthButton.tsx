import { SignInButton, SignOutButton, useUser } from "@clerk/remix"
import { LucideLogIn } from "lucide-react"
import { Button } from "~/components/Button.tsx"
import { LoadingSpinner } from "../../components/LoadingPlaceholder.tsx"

export function AuthButton() {
	const { user, isLoaded } = useUser()
	return (
		isLoaded === false ? <LoadingSpinner className="s-8" />
		: user ?
			<SignOutButton>
				<Button appearance="outline">
					Sign Out{" "}
					<img src={user.imageUrl} alt="" className="rounded-full s-8" />
				</Button>
			</SignOutButton>
		:	<SignInButton>
				<Button icon={{ end: LucideLogIn }}>Sign In</Button>
			</SignInButton>
	)
}
