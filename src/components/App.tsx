import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react"
import { api } from "convex/_generated/api"
import {
	LucideClock,
	LucideDices,
	LucideLogIn,
	LucideUsers,
} from "lucide-react"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Redirect, Route, Switch } from "wouter"
import { useIdentify } from "../helpers/useIdentify"
import { useQuerySuspense } from "../helpers/useQuerySuspense"
import { container } from "../styles/container"
import { panel } from "../styles/panel"
import { CharacterDetails } from "./CharacterDetails"
import { CharacterList } from "./CharacterList"
import { LoadingSpinner, LoadingSuspense } from "./LoadingPlaceholder"

export function App() {
	useIdentify()
	return (
		<div className={container("flex min-h-[100dvh] flex-col gap-4 p-4")}>
			<header className="flex">
				<div className="flex flex-1 items-center justify-end">
					<AuthButton />
				</div>
			</header>
			<div className="flex flex-1 gap-4">
				<SideNav />
				<LoadingSuspense className="flex-1 justify-start">
					<Switch>
						<Route path="/">
							<FirstCharacterRedirect />
						</Route>
						<Route path="/characters/:characterId">
							{(props) => <CharacterDetails {...props} />}
						</Route>
					</Switch>
				</LoadingSuspense>
			</div>
		</div>
	)
}

function FirstCharacterRedirect() {
	const first = useQuerySuspense(api.characters.list)[0]
	return first && <Redirect to={`/characters/${first._id}`} />
}

function AuthButton() {
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

function SideNav() {
	const views = [
		{
			id: "characters",
			title: "Characters",
			icon: LucideUsers,
			content: <CharacterList />,
		},
		{
			id: "dice",
			title: "Dice",
			icon: LucideDices,
			content: <p>todo</p>,
		},
		{
			id: "clocks",
			title: "Clocks",
			icon: LucideClock,
			content: <p>todo</p>,
		},
	] as const

	const [currentViewId, setCurrentViewId] = useState<string>(views[0].id)
	const currentView =
		views.find((view) => view.id === currentViewId) ?? views[0]

	return (
		<nav
			className={panel(
				"sticky top-8 flex h-[calc(100vh-5rem)] w-64 flex-col divide-y rounded-md border",
			)}
		>
			<header className="grid auto-cols-fr grid-flow-col divide-x divide-gray-800">
				{views.map((view) => (
					<button
						key={view.title}
						className={twMerge(
							"flex items-center justify-center gap-3 p-3 transition first:rounded-tl-md last:rounded-tr-md hover:bg-base-800 ",
							currentViewId === view.id
								? "opacity-100"
								: "opacity-50 hover:opacity-75",
						)}
						onClick={() => {
							setCurrentViewId(view.id)
						}}
					>
						<view.icon />
						<span className="sr-only">{view.title}</span>
					</button>
				))}
			</header>
			<main className="overflow-y-auto">
				<LoadingSuspense>{currentView.content}</LoadingSuspense>
			</main>
		</nav>
	)
}
