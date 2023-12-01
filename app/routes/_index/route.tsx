import { useUser } from "@clerk/remix"
import { useSearchParams } from "@remix-run/react"
import { api } from "convex/_generated/api.js"
import type { Id } from "convex/_generated/dataModel.js"
import { useConvexAuth } from "convex/react"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import { AuthButton } from "~/features/auth/AuthButton.tsx"
import { CharacterContext } from "~/features/characters/CharacterContext.tsx"
import { CharacterDetails } from "~/features/characters/CharacterDetails.tsx"
import { container } from "~/styles/container.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { useStableQuery } from "../../helpers/useStableQuery.tsx"
import { SideNav } from "./SideNav.tsx"
import { ViewportHeightScrollArea } from "./ViewportHeightScrollArea.tsx"

export default function GamePage() {
	return (
		<AuthLoadingCover>
			<div className={container("flex min-h-[100dvh] flex-col gap-4 p-4")}>
				<header className="flex h-12">
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
