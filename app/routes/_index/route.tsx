import { type LoaderFunctionArgs, redirect } from "@remix-run/node"
import { useSearchParams } from "@remix-run/react"
import { api } from "convex/_generated/api.js"
import type { Id } from "convex/_generated/dataModel.js"
import { ConvexHttpClient } from "convex/browser"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import { env } from "~/env.ts"
import { CharacterContext } from "~/features/characters/CharacterContext.tsx"
import { CharacterDetails } from "~/features/characters/CharacterDetails.tsx"
import { getPreferences } from "~/features/preferences.server.ts"
import { container } from "~/styles/container.ts"
import { useStableQuery } from "../../helpers/useStableQuery.tsx"
import { SideNav } from "./SideNav.tsx"
import { ViewportHeightScrollArea } from "./ViewportHeightScrollArea.tsx"

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url)

	const characterId = url.searchParams.get(
		"characterId",
	) as Id<"characters"> | null

	const preferences = await getPreferences(request)

	if (characterId) {
		return preferences.update({ characterId })
	}

	if (preferences.data.characterId) {
		url.searchParams.set("characterId", preferences.data.characterId)
		return redirect(url.toString())
	}

	const convex = new ConvexHttpClient(env.VITE_PUBLIC_CONVEX_URL)

	const [characters, self] = await Promise.all([
		convex.query(api.characters.list),
		convex.query(api.players.self),
	])

	const visibleCharacters = characters?.filter((c) => !c.hidden)
	const selfCharacter = characters?.find(
		(c) => c._id === self?.ownedCharacterId,
	)

	const defaultCharacterId =
		selfCharacter?._id ?? visibleCharacters?.[0]?._id ?? characters?.[0]?._id
	if (!defaultCharacterId) return new Response()

	url.searchParams.set("characterId", defaultCharacterId)
	return redirect(url.toString())
}

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
