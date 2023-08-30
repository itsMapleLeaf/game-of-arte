import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"

export function useCharacterDataValue(
	character: Doc<"characters">,
	key: string,
) {
	const value = character.data[key]

	const update = useMutation(api.characters.updateData).withOptimisticUpdate(
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

	function setValue(newValue: string | number) {
		void update({ id: character._id, data: { [key]: newValue } })
	}

	return [value, setValue] as const
}
