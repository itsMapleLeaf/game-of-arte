import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { panel } from "../styles/panel"
import { LoadingSuspense } from "./LoadingPlaceholder"

export type SideNavView = {
	readonly id: string
	readonly title: string
	readonly icon: React.ComponentType
	readonly content: React.ReactNode
}

export function SideNav({
	views,
}: {
	views: readonly [SideNavView, ...SideNavView[]]
}) {
	const [currentViewId, setCurrentViewId] = useState(views[0].id)
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
