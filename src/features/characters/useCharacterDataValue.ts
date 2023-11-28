import type { Doc } from "convex/_generated/dataModel.js"
import { type CharacterData, parseCharacterData } from "./data.ts"
import { useUpdateCharacterData } from "./useUpdateCharacterData.ts"

export function useCharacterDataValue(
	character: Doc<"characters">,
	key: keyof CharacterData,
) {
	const value = parseCharacterData(character.data)[key]
	const update = useUpdateCharacterData()

	function setValue(newValue: string | number) {
		void update(character._id, { [key]: newValue })
	}

	return [value, setValue] as const
}
