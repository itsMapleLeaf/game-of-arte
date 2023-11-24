import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"

export function useSetSorceryDeviceMutation() {
	return useMutation(api.characters.setSorceryDevice).withOptimisticUpdate(
		(store, args) => {
			const character = store.getQuery(api.characters.get, { id: args.id })
			if (!character) return

			store.setQuery(
				api.characters.get,
				{ id: args.id },
				{
					...character,
					sorceryDevice: args.sorceryDevice ?? undefined,
				},
			)
		},
	)
}
