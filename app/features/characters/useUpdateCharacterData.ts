import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import type { AttributeId } from "./attributes.ts"
import type { CharacterData } from "./data.ts"

export function useUpdateCharacterData() {
	const mutate = useMutation(api.characters.updateData).withOptimisticUpdate(
		(store, args) => {
			const character = store.getQuery(api.characters.get, { id: args.id })
			if (!character) return

			store.setQuery(
				api.characters.get,
				{ id: character._id },
				{
					...character,
					data: { ...character.data, ...args.data },
				},
			)
		},
	)

	return function useUpdateCharacterData(
		characterId: Id<"characters">,
		data: Partial<CharacterData & Record<AttributeId, number>>,
	) {
		return mutate({ id: characterId, data })
	}
}
