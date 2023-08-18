import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react"
import { api } from "convex/_generated/api"
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react"
import { useEffect } from "react"

export function App() {
	const auth = useConvexAuth()
	const { user } = useUser()
	const identify = useAction(api.auth.identify)

	useEffect(() => {
		if (auth.isLoading) return
		if (!auth.isAuthenticated) return
		if (!user) return
		identify()
	}, [auth.isAuthenticated, auth.isLoading, identify, user])

	const roles = useQuery(api.auth.roles)
	const characters = useQuery(api.characters.list)
	const createCharacter = useMutation(api.characters.protectedCreate)
	const removeCharacter = useMutation(api.characters.remove)

	return (
		<>
			<pre>{JSON.stringify(roles, null, 2)}</pre>
			<header>
				{user && <p>{user.username}</p>}
				{user ? <SignOutButton /> : <SignInButton />}
			</header>
			<button
				onClick={() => {
					createCharacter({ name: "Mysterious Wanderer" })
				}}
			>
				Create Character
			</button>
			{characters === undefined ? (
				<p>Loading...</p>
			) : characters.length === 0 ? (
				<p>No characters found.</p>
			) : (
				<ul>
					{characters?.map((character) => (
						<li key={character._id}>
							{character.name}{" "}
							<button onClick={() => removeCharacter({ id: character._id })}>
								Delete
							</button>
						</li>
					))}
				</ul>
			)}
		</>
	)
}
