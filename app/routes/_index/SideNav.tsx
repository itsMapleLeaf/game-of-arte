import { api } from "convex/_generated/api.js"
import { useQuery } from "convex/react"
import {
	LucideClock,
	LucideDices,
	LucideGamepad2,
	LucideUsers,
	LucideWrench,
} from "lucide-react"
import { useEffect, useState } from "react"
import { AdminRoleGuard } from "~/features/auth/AdminRoleGuard.tsx"
import { CharacterList } from "~/features/characters/CharacterList.tsx"
import { ClockList } from "~/features/clocks/ClockList.tsx"
import { DiceRollForm } from "~/features/dice/DiceRollForm.tsx"
import { DiceRollList } from "~/features/dice/DiceRollList.tsx"
import { PlayerList } from "~/features/players/PlayerList.tsx"
import { WorldSettings } from "~/features/worlds/WorldSettings.tsx"
import { useLocalStorageState } from "~/helpers/useLocalStorageState.tsx"
import { useNow } from "~/helpers/useNow.tsx"
import { Collapse, CollapseButton, CollapseContent } from "~/ui/Collapse.tsx"
import { LoadingPlaceholder } from "~/ui/LoadingPlaceholder"
import { panel } from "~/ui/styles"

export function SideNav() {
	return (
		<nav className="flex flex-col gap-2">
			<SideNavCollapse title="Characters" icon={<LucideUsers />} defaultOpen>
				<div className={panel("group overflow-clip rounded-md border")}>
					<CharacterList />
				</div>
			</SideNavCollapse>

			<DiceCollapse />

			<SideNavCollapse title="Clocks" icon={<LucideClock />}>
				<div className={panel("group overflow-clip rounded-md border")}>
					<ClockList />
				</div>
			</SideNavCollapse>

			<AdminRoleGuard>
				<SideNavCollapse title="Players" icon={<LucideGamepad2 />}>
					<PlayerList />
				</SideNavCollapse>

				<SideNavCollapse title="Manage World" icon={<LucideWrench />}>
					<div className={panel("group overflow-clip rounded-md border")}>
						<WorldSettings />
					</div>
				</SideNavCollapse>
			</AdminRoleGuard>
		</nav>
	)
}

function DiceCollapse() {
	const [open, setOpen] = useLocalStorageState("dice-collapse", (input) =>
		typeof input === "boolean" ? input : false,
	)
	const [indicatorVisible, setIndicatorVisible] = useState(false)

	const pageSize = 5
	const listResult = useQuery(api.diceRolls.list, { limit: pageSize })
	const latestRoll = listResult?.page[0]

	const now = useNow()
	const recentRollId =
		latestRoll && now - latestRoll._creationTime < 2000 ?
			latestRoll._id
		:	undefined

	useEffect(() => {
		if (recentRollId && !open) {
			setIndicatorVisible(true)
		}
	}, [recentRollId, open])

	return (
		<SideNavCollapse
			title="Dice"
			indicatorVisible={indicatorVisible && !open}
			icon={<LucideDices />}
			open={open}
			setOpen={(open) => {
				setOpen(open)
				setIndicatorVisible(false)
			}}
		>
			<div
				className={panel(
					"group flex flex-col divide-y divide-base-800 overflow-clip rounded-md border",
				)}
			>
				<div className="-mt-px flex-1">
					{listResult === undefined ?
						<LoadingPlaceholder />
					:	<DiceRollList
							listResult={{
								...listResult,
								// we need to slice since new items can make the page bigger (lol)
								page: listResult.page.slice(0, pageSize),
							}}
							recentRollId={recentRollId}
						/>
					}
				</div>
				<DiceRollForm />
			</div>
		</SideNavCollapse>
	)
}

function SideNavCollapse({
	title,
	icon,
	defaultOpen = false,
	open,
	setOpen,
	indicatorVisible,
	children,
}: {
	title: string
	icon: React.ReactNode
	defaultOpen?: boolean
	open?: boolean
	setOpen?: (open: boolean) => void
	indicatorVisible?: boolean
	children: React.ReactNode
}) {
	return (
		<div>
			<Collapse
				persistenceKey={`side-nav-collapse:${title}`}
				defaultOpen={defaultOpen}
				open={open}
				setOpen={setOpen}
			>
				<CollapseButton className="px-1 py-2">
					<div className="flex items-center gap-2 rounded-t-md">
						{icon}
						{title}
						{indicatorVisible && (
							<span className="inline-flex animate-ping rounded-full bg-accent-400 opacity-75 s-2" />
						)}
					</div>
				</CollapseButton>
				<CollapseContent className="pt-1">{children}</CollapseContent>
			</Collapse>
		</div>
	)
}
