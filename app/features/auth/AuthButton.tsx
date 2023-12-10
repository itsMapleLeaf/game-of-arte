import { SignInButton, SignOutButton, useUser } from "@clerk/remix"
import { LucideLogIn } from "lucide-react"
import { Button } from "~/components/Button.tsx"

export function AuthButton() {
	const { user } = useUser()
	return user ?
			<SignOutButton>
				<Button appearance="outline">
					Sign Out{" "}
					<img src={user.imageUrl} alt="" className="rounded-full s-8" />
				</Button>
			</SignOutButton>
		:	<SignInButton>
				<Button icon={LucideLogIn}>Sign In</Button>
			</SignInButton>
}
