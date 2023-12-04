import { useLocation, useNavigate } from "@remix-run/react"
import type { Id } from "convex/_generated/dataModel.js"

const characterIdParam = "characterId"

type Location = {
	pathname: string
	search: string
}

export class CharacterNavigation {
	readonly #location: Location

	constructor(location: Location | URL) {
		this.#location = location
	}

	get characterId() {
		return new URLSearchParams(this.#location.search).get(
			characterIdParam,
		) as Id<"characters"> | null
	}

	getCharacterLink(characterId: Id<"characters">) {
		const params = new URLSearchParams(this.#location.search)
		params.set(characterIdParam, characterId)
		return `${this.#location.pathname}?${params.toString()}`
	}
}

export function useCharacterNavigation() {
	const location = useLocation()
	const navigate = useNavigate()

	const navigation = new CharacterNavigation(location)

	const getCharacterLink = (characterId: Id<"characters">) =>
		navigation.getCharacterLink(characterId)

	return {
		get characterId() {
			return navigation.characterId
		},
		setCharacterId(characterId: Id<"characters">) {
			navigate(getCharacterLink(characterId))
		},
		getCharacterLink,
	}
}
