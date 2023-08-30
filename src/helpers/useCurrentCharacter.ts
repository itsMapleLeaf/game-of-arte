import { api } from "convex/_generated/api.js"
import { useAppParams } from "./useAppParams.ts"
import { useQuerySuspense } from "./useQuerySuspense.ts"

export function useCurrentCharacter() {
	const params = useAppParams()
	const characterId = params.characterId.current
	const characters = useQuerySuspense(api.characters.list)
	const loadedCharacter = useQuerySuspense(api.characters.get, {
		id: characterId,
	})
	const assignedCharacter = useQuerySuspense(api.characters.getOwned)

	if (!characterId) {
		return assignedCharacter
	}

	if (!loadedCharacter) {
		return characters[0]
	}

	return loadedCharacter
}
