import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import type { FunctionArgs } from "convex/server"
import type { StrictOmit } from "~/helpers/types.ts"

export type UpdateCharacterArgs = StrictOmit<
	FunctionArgs<typeof api.characters.update>,
	"id"
>

export function useUpdateCharacter() {
	const mutate = useMutation(api.characters.update).withOptimisticUpdate(
		(store, args) => {
			const current = store.getQuery(api.characters.get, { id: args.id })
			if (!current) return

			store.setQuery(
				api.characters.get,
				{ id: args.id },
				{ ...current, name: args.name ?? current.name },
			)
		},
	)

	return function updateCharacter(
		id: Id<"characters">,
		args: UpdateCharacterArgs,
	) {
		return mutate({ ...args, id })
	}
}
