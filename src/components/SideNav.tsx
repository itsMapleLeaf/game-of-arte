import { api } from "convex/_generated/api.js"
import {
	LucideChevronLeft,
	LucideClock,
	LucideDices,
	LucideGamepad2,
	LucideUsers,
	LucideWrench,
} from "lucide-react"
import { CharacterList } from "../features/characters/CharacterList.tsx"
import { ClockList } from "../features/clocks/ClockList.tsx"
import { DiceRollList } from "../features/dice/DiceRollList.tsx"
import { PlayerList } from "../features/players/PlayerList.tsx"
import { WorldSettings } from "../features/worlds/WorldSettings.tsx"
import { useQuerySuspense } from "../helpers/useQuerySuspense.ts"
import { panel } from "../styles/panel.ts"
import { LoadingSuspense } from "./LoadingPlaceholder.tsx"

export function SideNav() {
	const roles = useQuerySuspense(api.roles.get)
	return (
		<div className="flex flex-col gap-4">
			<SideNavCollapsible title="Characters" icon={<LucideUsers />} defaultOpen>
				<CharacterList />
			</SideNavCollapsible>

			<SideNavCollapsible title="Dice" icon={<LucideDices />}>
				<div className="h-[640px]">
					<DiceRollList />
				</div>
			</SideNavCollapsible>

			<SideNavCollapsible title="Clocks" icon={<LucideClock />}>
				<ClockList />
			</SideNavCollapsible>

			{roles.isAdmin && (
				<SideNavCollapsible title="Players" icon={<LucideGamepad2 />}>
					<PlayerList />
				</SideNavCollapsible>
			)}

			{roles.isAdmin && (
				<SideNavCollapsible title="Manage World" icon={<LucideWrench />}>
					<WorldSettings />
				</SideNavCollapsible>
			)}
		</div>
	)
}

function SideNavCollapsible({
	title,
	icon,
	defaultOpen,
	children,
}: {
	title: string
	icon: React.ReactNode
	defaultOpen?: boolean
	children: React.ReactNode
}) {
	return (
		<details
			className={panel("group rounded-md border")}
			open={
				localStorage.getItem(`collapse:${title}`) ?
					localStorage.getItem(`collapse:${title}`) === "true"
				:	defaultOpen
			}
			onToggle={(event) => {
				localStorage.setItem(
					`collapse:${title}`,
					event.currentTarget.open.toString(),
				)
			}}
		>
			<summary className="flex cursor-pointer select-none list-none gap-2 rounded-t-md bg-base-800 p-2 transition hover:text-accent-400">
				<div>{icon}</div>
				<div className="flex-1">{title}</div>
				<LucideChevronLeft className="transition-transform group-open:-rotate-90" />
			</summary>
			<LoadingSuspense>{children}</LoadingSuspense>
		</details>
	)
}
