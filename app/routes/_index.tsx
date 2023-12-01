import { useUser } from "@clerk/remix"
import { useSearchParams } from "@remix-run/react"
import { api } from "convex/_generated/api.js"
import type { Id } from "convex/_generated/dataModel.js"
import { useConvexAuth, useQuery } from "convex/react"
import type { FunctionReference, OptionalRestArgs } from "convex/server"
import { useRef } from "react"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import {
	ScrollAreaRoot,
	ScrollAreaScrollbar,
	ScrollAreaViewport,
} from "~/components/ScrollArea.tsx"
import { AuthButton } from "~/features/auth/AuthButton.tsx"
import { CharacterContext } from "~/features/characters/CharacterContext.tsx"
import { CharacterDetails } from "~/features/characters/CharacterDetails.tsx"
import { expect } from "~/helpers/expect.ts"
import { container } from "~/styles/container.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { SideNav } from "../components/SideNav.tsx"
import { useIsomorphicLayoutEffect } from "../helpers/useIsomorphicLayoutEffect.tsx"

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

/* @forgetti skip */
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
	const character = useStableQuery(api.characters.get, { id: characterId })
	return (
		characterId === null ? <p>No character selected.</p>
		: character === undefined ? <LoadingPlaceholder />
		: character === null ? <p>Character not found.</p>
		: <CharacterContext.Provider value={character}>
				<CharacterDetails character={character} />
			</CharacterContext.Provider>
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
