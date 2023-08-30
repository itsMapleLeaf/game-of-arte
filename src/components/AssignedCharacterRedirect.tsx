import { api } from "convex/_generated/api.js"
import { useEffect } from "react"
import { useAppParams } from "../helpers/useAppParams.ts"
import { useEffectEvent } from "../helpers/useEffectEvent.ts"
import { useQuerySuspense } from "../helpers/useQuerySuspense.ts"

export function AssignedCharacterRedirect() {
	const assignedCharacter = useQuerySuspense(api.characters.getOwned)
	const params = useAppParams()
	const characterId = params.characterId.current

	const doRedirect = useEffectEvent((characterId: string) => {
		params.characterId.replace(characterId)
	})

	useEffect(() => {
		if (!characterId && assignedCharacter) {
			doRedirect(assignedCharacter._id)
		}
	}, [characterId, assignedCharacter, doRedirect])

	return null
}
