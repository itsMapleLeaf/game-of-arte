import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react"
import {
	LucideClock,
	LucideDices,
	type LucideIcon,
	LucideLoader2,
	LucideLogIn,
	LucideUsers,
} from "lucide-react"
import { twMerge } from "tailwind-merge"
import { panel } from "../styles/panel.ts"

export function MobileBottomNav() {
	return (
		<footer className={panel("sticky bottom-0 mt-auto border-t shadow-md")}>
			<nav className="mx-auto grid w-full max-w-lg auto-cols-fr grid-flow-col">
				<button
					type="button"
					className="opacity-50 transition aria-[current=page]:opacity-100"
				>
					<TabContent icon={LucideUsers} label="Characters" />
				</button>
				<button
					type="button"
					className="opacity-50 transition aria-[current=page]:opacity-100"
				>
					<TabContent icon={LucideClock} label="Clocks" />
				</button>
				<button
					type="button"
					className="opacity-50 transition aria-[current=page]:opacity-100"
				>
					<TabContent icon={LucideDices} label="Dice" />
				</button>
				<AuthButton />
			</nav>
		</footer>
	)
}

function AuthButton() {
	const { user, isLoaded } = useUser()

	if (!isLoaded) {
		return (
			<TabContent
				icon={LucideLoader2}
				iconClass="animate-spin"
				label="Loading..."
			/>
		)
	}

	if (!user) {
		return (
			<SignInButton>
				<button type="button">
					<TabContent icon={LucideLogIn} label="Sign In" />
				</button>
			</SignInButton>
		)
	}

	return (
		<SignOutButton>
			<button type="button">
				<TabContent icon={user.imageUrl} label="Sign Out" />
			</button>
		</SignOutButton>
	)
}

function TabContent({
	icon: Icon,
	iconClass,
	label,
}: {
	icon: LucideIcon | string
	iconClass?: string
	label: string
}) {
	return (
		<div className="flex flex-col items-center gap-1 py-2.5 text-center text-xs font-medium leading-none">
			{typeof Icon === "string" ? (
				<img
					src={Icon}
					alt=""
					className={twMerge("rounded-full s-6", iconClass)}
				/>
			) : (
				<Icon className={twMerge("s-6", iconClass)} />
			)}
			<span>{label}</span>
		</div>
	)
}
