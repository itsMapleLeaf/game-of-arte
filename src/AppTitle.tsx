import { useEffect } from "react"
import { useCurrentCharacter } from "./features/characters/useCurrentCharacter.tsx"

export function AppTitle() {
	const character = useCurrentCharacter()

	useEffect(() => {
		if (character) {
			document.title = `${character.name} | Game of Arte`
		} else {
			document.title = "Game of Arte"
		}
	}, [character])

	return null
}
