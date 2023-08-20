import { api } from "convex/_generated/api"
import { type Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { input } from "../../styles/index.ts"
import { Field } from "../Field.tsx"

export function NameInput({ character }: { character: Doc<"characters"> }) {
	const update = useMutation(api.characters.update).withOptimisticUpdate(
		(store, args) => {
			store.setQuery(
				api.characters.get,
				{ id: character._id },
				{ ...character, name: args.name },
			)
		},
	)

	return (
		<Field label="Name" description="What should we call them?">
			<input
				className={input()}
				value={character.name}
				onChange={(event) => {
					void update({ id: character._id, name: event.target.value })
				}}
			/>
		</Field>
	)
}
