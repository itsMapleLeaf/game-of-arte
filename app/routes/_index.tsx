import { useRect } from "@reach/rect"
import { api } from "convex/_generated/api.js"
import {
	LucideClock,
	LucideDices,
	LucideGamepad2,
	LucideUsers,
	LucideWrench,
} from "lucide-react"
import { useLayoutEffect, useRef } from "react"
import { CollapsePersisted, CollapseSummary } from "~/components/Collapse.tsx"
import { LoadingSuspense } from "~/components/LoadingPlaceholder.tsx"
import {
	ScrollAreaRoot,
	ScrollAreaScrollbar,
	ScrollAreaViewport,
} from "~/components/ScrollArea.tsx"
import { AuthButton } from "~/features/auth/AuthButton.tsx"
import { CharacterDetails } from "~/features/characters/CharacterDetails.tsx"
import { CharacterList } from "~/features/characters/CharacterList.tsx"
import { ClockList } from "~/features/clocks/ClockList.tsx"
import { DiceRolls } from "~/features/dice/DiceRolls.tsx"
import { PlayerList } from "~/features/players/PlayerList.tsx"
import { WorldSettings } from "~/features/worlds/WorldSettings.tsx"
import { expect } from "~/helpers/expect.ts"
import { useQuerySuspense } from "~/helpers/useQuerySuspense.ts"
import { container } from "~/styles/container.ts"
import { panel } from "~/styles/panel.ts"

export default function GamePage() {
	return (
		<div className={container("flex min-h-[100dvh] flex-col gap-4 p-4")}>
			<header className="flex">
				<div className="flex flex-1 items-center justify-end">
					<AuthButton />
				</div>
			</header>
			<div className="flex flex-1 gap-4">
				<ViewportHeightScrollArea>
					<SideNav />
				</ViewportHeightScrollArea>
				<LoadingSuspense className="flex-1 justify-start">
					<CharacterDetails />
				</LoadingSuspense>
			</div>
		</div>
	)
}

function SideNav() {
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
	return (
		<CollapsePersisted
			persistenceKey={`side-nav-collapse:${title}`}
			defaultOpen={defaultOpen}
			className={panel("group rounded-md border bg-base-800")}
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
		</CollapsePersisted>
	)
}

function ViewportHeightScrollArea({ children }: { children: React.ReactNode }) {
	const referenceRef = useRef<HTMLDivElement>(null)

	useIsomorphicLayoutEffect(() => {
		const reference = expect(referenceRef.current)
		const { offsetTop, offsetHeight, style } = reference
		const rect = reference.getBoundingClientRect()
		style.setProperty("--scroll-area-left", `${rect.left}px`)
		style.setProperty("--scroll-area-top", `${offsetTop}px`)
		style.setProperty(
			"--scroll-area-bottom",
			`${document.documentElement.scrollHeight - (offsetTop + offsetHeight)}px`,
		)
	})

	return (
		<div
			style={
				{
					"--scroll-area-width": "280px",
					"--scroll-area-top": "64px",
					"--scroll-area-bottom": "0px",
				} as React.CSSProperties
			}
			className="w-[--scroll-area-width]"
			ref={referenceRef}
		>
			<div className="fixed bottom-0 left-[--scroll-area-left] top-0 w-[--scroll-area-width] overflow-hidden">
				<ScrollAreaRoot className="s-full">
					<ScrollAreaViewport className="pb-[--scroll-area-bottom] pr-3 pt-[--scroll-area-top]">
						{children}
					</ScrollAreaViewport>
					<ScrollAreaScrollbar className="pb-[--scroll-area-bottom] pt-[--scroll-area-top]" />
				</ScrollAreaRoot>
			</div>
		</div>
	)
}
