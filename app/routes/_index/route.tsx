import { useSearchParams } from "@remix-run/react"
import { api } from "convex/_generated/api.js"
import type { Id } from "convex/_generated/dataModel.js"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import { CharacterContext } from "~/features/characters/CharacterContext.tsx"
import { CharacterDetails } from "~/features/characters/CharacterDetails.tsx"
import { container } from "~/styles/container.ts"
import { useStableQuery } from "../../helpers/useStableQuery.tsx"
import { SideNav } from "./SideNav.tsx"
import { ViewportHeightScrollArea } from "./ViewportHeightScrollArea.tsx"

export default function GamePage() {
	return (
		<div className={container("flex flex-1 gap-4 pb-8 pt-4")}>
			<ViewportHeightScrollArea>
				<nav className="flex flex-col gap-4">
					<SideNav />
				</nav>
			</ViewportHeightScrollArea>
			<main className="flex-1">
				<MainContent />
			</main>
		</div>
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
