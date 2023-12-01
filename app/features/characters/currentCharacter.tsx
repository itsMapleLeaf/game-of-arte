import { useSearchParams } from "@remix-run/react"
import { api } from "convex/_generated/api.js"
import type { Doc, Id } from "convex/_generated/dataModel.js"
import { useQuery } from "convex/react"
import { createContext, useContext } from "react"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import { CharacterContext } from "~/features/characters/CharacterContext.tsx"

const empty = Symbol("empty")
const Context = createContext<Doc<"characters"> | typeof empty>(empty)

export function CurrentCharacterProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [searchParams] = useSearchParams()
	const currentCharacterId = searchParams.get(
		"characterId",
	) as Id<"characters"> | null

	const character = useQuery(api.characters.get, { id: currentCharacterId })

	return (
		currentCharacterId === null ? <p>No character selected.</p>
		: character === undefined ? <LoadingPlaceholder />
		: character === null ? <p>Character not found.</p>
		: <CharacterContext.Provider value={character}>
				{children}
			</CharacterContext.Provider>
	)
}

export function useCurrentCharacter() {
	const character = useContext(Context)
	if (character === empty) {
		throw new Error(
			"useCurrentCharacter() must be used within a CurrentCharacterProvider.",
		)
	}
	return character
}
