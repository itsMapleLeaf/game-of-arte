import { useUser } from "@clerk/remix"
import { useSearchParams } from "@remix-run/react"
import { api } from "convex/_generated/api.js"
import type { Id } from "convex/_generated/dataModel.js"
import { useConvexAuth, useQuery } from "convex/react"
import type { FunctionReference, OptionalRestArgs } from "convex/server"
import {
	LucideClock,
	LucideDices,
	LucideGamepad2,
	LucideUsers,
	LucideWrench,
} from "lucide-react"
import { useDeferredValue, useRef } from "react"
import { CollapsePersisted, CollapseSummary } from "~/components/Collapse.tsx"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import {
	ScrollAreaRoot,
	ScrollAreaScrollbar,
	ScrollAreaViewport,
} from "~/components/ScrollArea.tsx"
import { AdminRoleGuard } from "~/features/auth/AdminRoleGuard.tsx"
import { AuthButton } from "~/features/auth/AuthButton.tsx"
import { CharacterContext } from "~/features/characters/CharacterContext.tsx"
import { CharacterDetails } from "~/features/characters/CharacterDetails.tsx"
import { CharacterList } from "~/features/characters/CharacterList.tsx"
import { ClockList } from "~/features/clocks/ClockList.tsx"
import { DiceRolls } from "~/features/dice/DiceRolls.tsx"
import { PlayerList } from "~/features/players/PlayerList.tsx"
import { WorldSettings } from "~/features/worlds/WorldSettings.tsx"
import { expect } from "~/helpers/expect.ts"
import { container } from "~/styles/container.ts"
import { panel } from "~/styles/panel.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { useIsomorphicLayoutEffect } from "../helpers/useIsomorphicLayoutEffect"

export default function GamePage() {
	return (
		<AuthLoadingCover>
			<div className={container("flex min-h-[100dvh] flex-col gap-4 p-4")}>
				<header className="flex">
					<div className="flex flex-1 items-center justify-end">
						<AuthButton />
					</div>
				</header>
				<div className="flex flex-1 gap-4">
					<ViewportHeightScrollArea>
						<nav className="flex flex-col gap-4">
							<SideNav />
						</nav>
					</ViewportHeightScrollArea>
					<main className="flex-1">
						<MainContent />
					</main>
				</div>
			</div>
		</AuthLoadingCover>
	)
}

function AuthLoadingCover({ children }: { children: React.ReactNode }) {
	const clerkAuth = useUser()
	const convexAuth = useConvexAuth()
	const authLoading = !clerkAuth.isLoaded || convexAuth.isLoading
	return (
		<>
			{children}
			<LoadingPlaceholder
				className={twMerge(
					"fixed inset-0 bg-base-950 transition-all duration-300",
					authLoading ? "visible opacity-100" : "invisible opacity-0",
				)}
			>
				Just a moment...
			</LoadingPlaceholder>
		</>
	)
}

function useStableQuery<FuncRef extends FunctionReference<"query", "public">>(
	func: FuncRef,
	...args: OptionalRestArgs<FuncRef>
) {
	const data = useQuery(func, ...args)
	const ref = useRef(data)
	if (data !== undefined) {
		ref.current = data
	}
	return ref.current
}

function MainContent() {
	const [searchParams] = useSearchParams()
	const characterId = searchParams.get("characterId") as Id<"characters"> | null
	const character = useDeferredValue(
		useStableQuery(api.characters.get, { id: characterId }),
	)
	return (
		characterId === null ? <p>No character selected.</p>
		: character === undefined ? <LoadingPlaceholder />
		: character === null ? <p>Character not found.</p>
		: <CharacterContext.Provider value={character}>
				<CharacterDetails character={character} />
			</CharacterContext.Provider>
	)
}

function SideNav() {
	return (
		<>
			<SideNavCollapse title="Characters" icon={<LucideUsers />} defaultOpen>
				<CharacterList />
			</SideNavCollapse>

			<SideNavCollapse title="Dice" icon={<LucideDices />}>
				<DiceRolls />
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
			<div className="bg-base-900">{children}</div>
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
