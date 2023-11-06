import { api } from "convex/_generated/api.js"
import {
	LucideClock,
	LucideDices,
	LucideGamepad2,
	LucideGlobe,
	LucideUsers,
} from "lucide-react"
import { startTransition } from "react"
import { CharacterList } from "../features/characters/CharacterList.tsx"
import { ClockList } from "../features/clocks/ClockList.tsx"
import { DiceRollList } from "../features/dice/DiceRollList.tsx"
import { PlayerList } from "../features/players/PlayerList.tsx"
import { WorldSettings } from "../features/worlds/WorldSettings.tsx"
import { parseNonEmptyArray } from "../helpers/index.ts"
import { useQuerySuspense } from "../helpers/useQuerySuspense.ts"
import { panel } from "../styles/panel.ts"
import { useAppParams } from "../useAppParams.ts"
import { LoadingSuspense } from "./LoadingPlaceholder.tsx"

const defineView = (options: {
	id?: string
	title: string
	icon: React.ReactNode
	content: React.ReactNode
}) => ({
	...options,
	id: options.id ?? options.title.toLowerCase().replace(/\s/g, "-"),
})

export function SideNav() {
	const roles = useQuerySuspense(api.roles.get)
	const params = useAppParams()

	const views = parseNonEmptyArray(
		[
			defineView({
				title: "Characters",
				icon: <LucideUsers />,
				content: <CharacterList />,
			}),
			defineView({
				title: "Dice",
				icon: <LucideDices />,
				content: <DiceRollList />,
			}),
			defineView({
				title: "Clocks",
				icon: <LucideClock />,
				content: <ClockList />,
			}),
			roles.isAdmin &&
				defineView({
					title: "Players",
					icon: <LucideGamepad2 />,
					content: <PlayerList />,
				}),
			roles.isAdmin &&
				defineView({
					title: "World",
					icon: <LucideGlobe />,
					content: <WorldSettings />,
				}),
		].filter(Boolean),
	)

	const current =
		views.find((view) => view.id === params.tab.current) ?? views[0]

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
						type="button"
						data-active={view.id === current.id}
						className="flex items-center justify-center gap-3 p-3 opacity-40 transition first:rounded-tl-md last:rounded-tr-md hover:bg-base-800 hover:opacity-70 data-[active=true]:opacity-100"
						onClick={() => {
							startTransition(() => {
								params.tab.replace(view.id)
							})
						}}
					>
						{view.icon}
						<span className="sr-only">{view.title}</span>
					</button>
				))}
			</header>
			<section className="min-h-0 flex-1 overflow-y-auto">
				<LoadingSuspense>{current.content}</LoadingSuspense>
			</section>
		</nav>
	)
}
