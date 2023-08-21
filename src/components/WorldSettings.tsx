import { api } from "convex/_generated/api.js"
import { useMutation } from "convex/react"
import { useQuerySuspense } from "../helpers/useQuerySuspense.ts"
import { input } from "../styles/index.ts"
import { Field } from "./Field.tsx"

export function WorldSettings() {
	const world = useQuerySuspense(api.world.get)
	const update = useMutation(api.world.update).withOptimisticUpdate(
		(store, args) => {
			store.setQuery(api.world.get, {}, args)
		},
	)
	return (
		<div className="grid gap-3 p-3">
			<Field
				className={input()}
				label="Experience"
				description="Set the power level of your party."
				type="number"
				placeholder="0"
				value={world.experience}
				onChange={(event) => {
					void update({ experience: event.currentTarget.valueAsNumber })
				}}
			/>
		</div>
	)
}
