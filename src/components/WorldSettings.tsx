import { api } from "convex/_generated/api.js"
import { useMutation } from "convex/react"
import { useQuerySuspense } from "../helpers/useQuerySuspense.ts"
import { input } from "../styles/index.ts"
import { Field, FieldDescription, FieldInput, FieldLabel } from "./Field.tsx"

export function WorldSettings() {
	const world = useQuerySuspense(api.world.get)
	const update = useMutation(api.world.update).withOptimisticUpdate(
		(store, args) => {
			store.setQuery(api.world.get, {}, args)
		},
	)
	return (
		<div className="grid gap-3 p-3">
			<Field>
				<FieldLabel>Experience</FieldLabel>
				<FieldDescription>Set the power level of your party.</FieldDescription>
				<FieldInput
					className={input()}
					type="number"
					placeholder="10"
					value={world.experience}
					onChange={(event) => {
						void update({ experience: event.currentTarget.valueAsNumber })
					}}
				/>
			</Field>
		</div>
	)
}
