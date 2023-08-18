import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react"
import { api } from "convex/_generated/api"
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react"
import {
	LucideChevronRight,
	LucideClock,
	LucideDices,
	LucideIcon,
	LucideLogIn,
	LucideUser,
	LucideUsers,
} from "lucide-react"
import { useEffect } from "react"
import { Link, Redirect, Route, Switch } from "wouter"
import { panel } from "~/styles/panel"

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
		<div className="flex min-h-[100dvh] flex-col">
			<main className="mx-auto w-full max-w-screen-md p-2">
				<Switch>
					<Route path="/">
						<Redirect to="/characters" />
					</Route>
					<Route path="/characters">
						<ul className="grid gap-2">
							{characters?.map((character) => (
								<li key={character._id}>
									<Link
										href={`/characters/${character._id}`}
										className={panel(
											"flex items-center justify-between rounded-md border p-3 text-xl font-light leading-tight shadow",
										)}
									>
										{character.name}
										<LucideChevronRight className="-mr-2" />
									</Link>
								</li>
							))}
						</ul>
					</Route>
					<Route path="/characters/:characterId">
						{({ characterId }) => <p>{characterId}</p>}
					</Route>
					<Route path="/clocks">
						<p>clocks</p>
					</Route>
					<Route path="/dice">
						<p>dice</p>
					</Route>
				</Switch>
			</main>

			<footer className={panel("sticky bottom-0 mt-auto border-t shadow-md")}>
				<nav className="mx-auto grid w-full max-w-lg auto-cols-fr grid-flow-col">
					<Link href="/characters">
						<a>
							<TabNavItem icon={LucideUsers} label="Characters" />
						</a>
					</Link>
					<Link href="/clocks">
						<a>
							<TabNavItem icon={LucideClock} label="Clocks" />
						</a>
					</Link>
					<Link href="/dice">
						<a>
							<TabNavItem icon={LucideDices} label="Dice" />
						</a>
					</Link>
					{user ? (
						<SignOutButton>
							<button>
								<TabNavItem
									icon={user?.imageUrl ?? LucideUser}
									label="Sign Out"
								/>
							</button>
						</SignOutButton>
					) : (
						<SignInButton>
							<button>
								<TabNavItem icon={LucideLogIn} label="Sign In" />
							</button>
						</SignInButton>
					)}
				</nav>
			</footer>
		</div>
	)
}

function TabNavItem({
	icon: Icon,
	label,
}: {
	icon: LucideIcon | string
	label: string
}) {
	return (
		<div className="flex flex-col items-center gap-1 py-2.5 text-center text-xs font-medium leading-none">
			{typeof Icon === "string" ? (
				<img src={Icon} className="rounded-full s-6" />
			) : (
				<Icon className="s-6" />
			)}
			<span>{label}</span>
		</div>
	)
}
