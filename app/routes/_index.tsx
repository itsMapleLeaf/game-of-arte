import { useRect } from "@reach/rect"
import { api } from "convex/_generated/api.js"
import {
	LucideClock,
	LucideDices,
	LucideGamepad2,
	LucideUsers,
	LucideWrench,
} from "lucide-react"
import { useRef } from "react"
import { Collapse, CollapseSummary } from "~/components/Collapse.tsx"
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
import { useLocalStorageState } from "~/helpers/useLocalStorageState.tsx"
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

function ViewportHeightScrollArea({ children }: { children: React.ReactNode }) {
	const referenceRef = useRef<HTMLDivElement>(null)
	const rect = useRect(referenceRef)

	const scrollAreaTop = referenceRef.current?.offsetTop

	const scrollAreaBottom =
		document.documentElement.scrollHeight -
		((referenceRef.current?.offsetTop ?? 0) +
			(referenceRef.current?.offsetHeight ?? 0))

	return (
		<div
			className="w-[280px]"
			style={
				{
					"--scroll-area-top": `${scrollAreaTop ?? 0}px`,
					"--scroll-area-bottom": `${scrollAreaBottom ?? 0}px`,
				} as React.CSSProperties
			}
			ref={referenceRef}
		>
			<div
				className="fixed bottom-0 top-0"
				style={{
					left: rect?.left,
					width: rect?.width,
				}}
			>
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
