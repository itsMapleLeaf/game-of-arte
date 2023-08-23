import { api } from "convex/_generated/api.js"
import { useQuery } from "convex/react"
import { useEffect } from "react"
import { useAppParams } from "../helpers/useAppParams.ts"

export function AppTitle() {
	const params = useAppParams()

	const character = useQuery(api.characters.get, {
		id: params.characterId.current,
	})

	useEffect(() => {
		if (character) {
			document.title = `${character.name} | Game of Arte`
		} else {
			document.title = "Game of Arte"
		}
	}, [character])

	return null
}
