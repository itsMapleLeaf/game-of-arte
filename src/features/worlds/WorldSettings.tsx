import { api } from "convex/_generated/api.js"
import { useMutation } from "convex/react"
import { LucideRotateCw } from "lucide-react"
import { ConfirmDialog } from "../../components/ConfirmDialog.tsx"
import {
	Field,
	FieldDescription,
	FieldInput,
	FieldLabel,
} from "../../components/Field.tsx"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"
import { useQuerySuspense } from "../../helpers/useQuerySuspense.ts"
import { solidButton } from "../../styles/button.ts"
import { input } from "../../styles/index.ts"

export function WorldSettings() {
	const world = useQuerySuspense(api.world.get)

	const update = useMutation(api.world.update).withOptimisticUpdate(
		(store, args) => {
			store.setQuery(api.world.get, {}, args)
		},
	)

	return (
		<div className="grid gap-3 p-3">
			<ResetResilienceButton />
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

function ResetResilienceButton() {
	const characters = useQuerySuspense(api.characters.list)
	const updateCharacterData = useMutation(api.characters.updateData)

	// TODO: make this one mutation in the backend (probably)
	const [resetResilience, resetResilienceState] = useAsyncCallback(async () => {
		await Promise.all(
			characters.map((character) =>
				updateCharacterData({ id: character._id, data: { resilience: 2 } }),
			),
		)
	})

	return (
		<ConfirmDialog
			title="Reset Resilience"
			description="This will reset the resilience of all characters to 2. Are you sure?"
			confirmText="Yes, reset resilience"
			onConfirm={resetResilience}
		>
			<button
				type="button"
				className={solidButton()}
				disabled={resetResilienceState.isLoading}
			>
				<LucideRotateCw
					className={
						resetResilienceState.isLoading ? "animate-spin" : undefined
					}
				/>
				Reset Resilience
			</button>
		</ConfirmDialog>
	)
}
