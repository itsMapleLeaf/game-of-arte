import {
	LucideClock,
	LucideDices,
	LucideGamepad2,
	LucideUsers,
	LucideWrench,
} from "lucide-react"
import {
	Collapse,
	CollapseButton,
	CollapseContent,
} from "~/components/Collapse.tsx"
import { AdminRoleGuard } from "~/features/auth/AdminRoleGuard.tsx"
import { CharacterList } from "~/features/characters/CharacterList.tsx"
import { ClockList } from "~/features/clocks/ClockList.tsx"
import { DiceRollForm, DiceRollList } from "~/features/dice/DiceRolls"
import { PlayerList } from "~/features/players/PlayerList.tsx"
import { WorldSettings } from "~/features/worlds/WorldSettings.tsx"
import { expect } from "~/helpers/expect.ts"
import { panel } from "~/styles/panel.ts"

const sideNavDiceCollapseButtonId = "sideNavDiceCollapseButton"

export function showDiceRolls() {
	const button = expect(document.getElementById(sideNavDiceCollapseButtonId))
	if (button.ariaExpanded !== "true") {
		button.click()
		return true
	}
	return false
}

export function SideNav() {
	return (
		<>
			<SideNavCollapse title="Characters" icon={<LucideUsers />} defaultOpen>
				<CharacterList />
			</SideNavCollapse>

			<SideNavCollapse
				title="Dice"
				icon={<LucideDices />}
				buttonId={sideNavDiceCollapseButtonId}
			>
				<div className="flex h-full flex-col divide-y divide-base-800">
					<div className="-mt-px flex-1">
						<DiceRollList />
					</div>
					<DiceRollForm />
				</div>
			</SideNavCollapse>

			<SideNavCollapse title="Clocks" icon={<LucideClock />}>
				<ClockList />
			</SideNavCollapse>

			<AdminRoleGuard>
				<SideNavCollapse title="Players" icon={<LucideGamepad2 />}>
					<PlayerList />
				</SideNavCollapse>

				<SideNavCollapse title="Manage World" icon={<LucideWrench />}>
					<WorldSettings />
				</SideNavCollapse>
			</AdminRoleGuard>
		</>
	)
}

function SideNavCollapse({
	title,
	icon,
	defaultOpen = false,
	buttonId,
	children,
}: {
	title: string
	icon: React.ReactNode
	defaultOpen?: boolean
	buttonId?: string
	children: React.ReactNode
}) {
	return (
		<div className={panel("group rounded-md border bg-base-800")}>
			<Collapse
				persistenceKey={`side-nav-collapse:${title}`}
				defaultOpen={defaultOpen}
			>
				<CollapseButton className="p-2" id={buttonId}>
					<div className="flex items-center gap-2 rounded-t-md">
						{icon}
						{title}
					</div>
				</CollapseButton>
				<CollapseContent className="bg-base-900">{children}</CollapseContent>
			</Collapse>
		</div>
	)
}

export function DiceRolls() {
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			<div className="-mt-px flex-1">
				<DiceRollList />
			</div>
			<DiceRollForm />
		</div>
	)
}
