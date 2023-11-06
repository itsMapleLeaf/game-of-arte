import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { input } from "../../styles/index.ts"
import { Field, FieldDescription, FieldInput, FieldLabel } from "../Field.tsx"

export const nameInputId = "characterNameInput"

export function NameInput({ character }: { character: Doc<"characters"> }) {
	const update = useMutation(api.characters.update).withOptimisticUpdate(
		(store, args) => {
			const current = store.getQuery(api.characters.get, { id: args.id })
			if (!current) return

			store.setQuery(
				api.characters.get,
				{ id: character._id },
				{ ...current, name: args.name ?? current.name },
			)
		},
	)

	return (
		<Field>
			<FieldLabel>Name</FieldLabel>
			<FieldDescription>What should we call them?</FieldDescription>
			<FieldInput
				id={nameInputId}
				className={input()}
				value={character.name}
				onChange={(event) => {
					void update({ id: character._id, name: event.target.value })
				}}
			/>
		</Field>
	)
}
