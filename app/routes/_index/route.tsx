import { type LoaderFunctionArgs, redirect } from "@remix-run/node"
import { api } from "convex/_generated/api.js"
import { ConvexHttpClient } from "convex/browser"
import { env } from "~/env.ts"
import { CharacterContext } from "~/features/characters/CharacterContext.tsx"
import { CharacterDetails } from "~/features/characters/CharacterDetails.tsx"
import {
	CharacterNavigation,
	useCharacterNavigation,
} from "~/features/characters/navigation.ts"
import { getPreferences } from "~/features/preferences.server.ts"
import { LoadingPlaceholder } from "~/ui/LoadingPlaceholder.tsx"
import { container } from "~/ui/styles.ts"
import { useStableQuery } from "../../helpers/useStableQuery.tsx"
import { SideNav } from "./SideNav.tsx"
import { ViewportHeightScrollArea } from "./ViewportHeightScrollArea.tsx"

export async function loader({ request }: LoaderFunctionArgs) {
	const navigation = new CharacterNavigation(new URL(request.url))
	const preferences = await getPreferences(request)

	if (navigation.characterId) {
		return preferences.update({ characterId: navigation.characterId })
	}

	if (preferences.data.characterId) {
		return redirect(navigation.getCharacterLink(preferences.data.characterId))
	}

	const convex = new ConvexHttpClient(env.VITE_PUBLIC_CONVEX_URL)
	const defaultCharacter = await convex.query(api.characters.getDefault)
	if (!defaultCharacter) {
		return new Response()
	}

	return redirect(navigation.getCharacterLink(defaultCharacter._id))
}

export default function GamePage() {
	return (
		<div className={container("flex flex-1 gap-4 pb-8 pt-4")}>
			<ViewportHeightScrollArea>
				<SideNav />
			</ViewportHeightScrollArea>
			<main className="flex-1">
				<MainContent />
			</main>
		</div>
	)
}

function MainContent() {
	const navigation = useCharacterNavigation()
	const character = useStableQuery(api.characters.get, {
		id: navigation.characterId,
	})
	return (
		navigation.characterId === null ? <p>No character selected.</p>
		: character === undefined ? <LoadingPlaceholder />
		: character === null ? <p>Character not found.</p>
		: <CharacterContext.Provider value={character}>
				<CharacterDetails character={character} />
			</CharacterContext.Provider>
	)
}
