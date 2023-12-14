import { SignInButton, useUser } from "@clerk/remix"
import { LucideLogIn } from "lucide-react"
import { Button } from "~/ui/Button.tsx"
import { UserButton } from "./UserButton.tsx"

export function AuthButton() {
	const { user } = useUser()
	return user ?
			<UserButton user={user} />
		:	<SignInButton>
				<Button icon={LucideLogIn}>Sign In</Button>
			</SignInButton>
}
