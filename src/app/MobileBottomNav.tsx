import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react"
import {
	LucideClock,
	LucideDices,
	LucideLogIn,
	LucideUsers,
	type LucideIcon,
} from "lucide-react"
import { panel } from "~/styles/panel"
import { ActiveLink } from "../components/ActiveLink"

export function MobileBottomNav() {
	const { user, isLoaded } = useUser()
	return (
		<footer className={panel("sticky bottom-0 mt-auto border-t shadow-md")}>
			<nav className="mx-auto grid w-full max-w-lg auto-cols-fr grid-flow-col">
				<ActiveLink
					href="/characters"
					className="opacity-50 transition aria-[current=page]:opacity-100"
				>
					<TabNavItem icon={LucideUsers} label="Characters" />
				</ActiveLink>
				<ActiveLink
					href="/clocks"
					className="opacity-50 transition aria-[current=page]:opacity-100"
				>
					<TabNavItem icon={LucideClock} label="Clocks" />
				</ActiveLink>
				<ActiveLink
					href="/dice"
					className="opacity-50 transition aria-[current=page]:opacity-100"
				>
					<TabNavItem icon={LucideDices} label="Dice" />
				</ActiveLink>
				{!isLoaded ? null : user ? (
					<SignOutButton>
						<button>
							<TabNavItem icon={user.imageUrl} label="Sign Out" />
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
