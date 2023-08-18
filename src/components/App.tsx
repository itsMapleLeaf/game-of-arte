import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react"

export function App() {
	const { user } = useUser()
	return (
		<main>
			{user && <p>{user.username}</p>}
			{user ? <SignOutButton /> : <SignInButton />}
		</main>
	)
}
