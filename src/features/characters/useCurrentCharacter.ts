import { api } from "convex/_generated/api.js"
import { useQueriesSuspense } from "../../helpers/useQuerySuspense.ts"
import { useAppParams } from "../../useAppParams.ts"

export function useCurrentCharacter() {
	const params = useAppParams()
	const characterId = params.characterId.current

	const { characters, loadedCharacter, assignedCharacter } = useQueriesSuspense(
		{
			characters: { query: api.characters.list, args: {} },
			loadedCharacter: {
				query: api.characters.get,
				args: { id: characterId },
			},
			assignedCharacter: { query: api.characters.getOwned, args: {} },
		},
	)

	if (!characterId) {
		return assignedCharacter ?? characters[0]
	}

	return loadedCharacter
}
