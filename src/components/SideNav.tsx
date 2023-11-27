import { api } from "convex/_generated/api.js"
import {
	LucideClock,
	LucideDices,
	LucideGamepad2,
	LucideUsers,
	LucideWrench,
} from "lucide-react"
import { useLocalStorageState } from "~/helpers/useLocalStorageState.tsx"
import { CharacterList } from "../features/characters/CharacterList.tsx"
import { ClockList } from "../features/clocks/ClockList.tsx"
import { DiceRolls } from "../features/dice/DiceRolls.tsx"
import { PlayerList } from "../features/players/PlayerList.tsx"
import { WorldSettings } from "../features/worlds/WorldSettings.tsx"
import { useQuerySuspense } from "../helpers/useQuerySuspense.ts"
import { panel } from "../styles/panel.ts"
import { Collapse, CollapseSummary } from "./Collapse.tsx"
import { LoadingSuspense } from "./LoadingPlaceholder.tsx"

export function SideNav() {
	const roles = useQuerySuspense(api.roles.get)
	return (
		<div className="flex flex-col gap-4">
			<SideNavCollapse title="Characters" icon={<LucideUsers />} defaultOpen>
				<CharacterList />
			</SideNavCollapse>

			<SideNavCollapse title="Dice" icon={<LucideDices />}>
				<DiceRolls />
			</SideNavCollapse>

			<SideNavCollapse title="Clocks" icon={<LucideClock />}>
				<ClockList />
			</SideNavCollapse>

			{roles.isAdmin && (
				<SideNavCollapse title="Players" icon={<LucideGamepad2 />}>
					<PlayerList />
				</SideNavCollapse>
			)}

			{roles.isAdmin && (
				<SideNavCollapse title="Manage World" icon={<LucideWrench />}>
					<WorldSettings />
				</SideNavCollapse>
			)}
		</div>
	)
}

function SideNavCollapse({
	title,
	icon,
	defaultOpen = false,
	children,
}: {
	title: string
	icon: React.ReactNode
	defaultOpen?: boolean
	children: React.ReactNode
}) {
	const [open, setOpen] = useLocalStorageState(`collapse:${title}`, (input) => {
		return typeof input === "boolean" ? input : defaultOpen
	})
	return (
		<Collapse
			className={panel("group rounded-md border bg-base-800")}
			open={open}
			onToggle={(event) => setOpen(event.currentTarget.open)}
		>
			<CollapseSummary className="p-2">
				<div className="flex items-center gap-2 rounded-t-md">
					{icon}
					{title}
				</div>
			</CollapseSummary>
			<div className="bg-base-900">
				<LoadingSuspense>{children}</LoadingSuspense>
			</div>
		</Collapse>
	)
}
