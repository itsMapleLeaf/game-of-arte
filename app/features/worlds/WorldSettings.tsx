import { api } from "convex/_generated/api.js"
import { useMutation, useQuery } from "convex/react"
import { LucideRotateCw } from "lucide-react"
import { Button } from "~/ui/Button.tsx"
import { LoadingPlaceholder } from "~/ui/LoadingPlaceholder.tsx"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"
import { ConfirmDialog } from "../../ui/ConfirmDialog.tsx"
import {
	Field,
	FieldDescription,
	FieldInput,
	FieldLabel,
} from "../../ui/Field.tsx"
import { input } from "../../ui/styles.ts"

export function WorldSettings() {
	const world = useQuery(api.world.get)

	const update = useMutation(api.world.update).withOptimisticUpdate(
		(store, args) => {
			if (!world) return
			store.setQuery(api.world.get, {}, { ...world, ...args })
		},
	)

	return world === undefined ?
			<LoadingPlaceholder />
		:	<div className="grid gap-3 p-3">
				<ResetResilienceButton />
				<Field>
					<FieldLabel>Experience</FieldLabel>
					<FieldDescription>
						Set the power level of your party.
					</FieldDescription>
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
}

function ResetResilienceButton() {
	const characters = useQuery(api.characters.list)
	const updateCharacterData = useMutation(api.characters.updateData)

	// TODO: make this one mutation in the backend (probably)
	const [resetResilience, resetResilienceState] = useAsyncCallback(async () => {
		await Promise.all(
			characters?.map((character) =>
				updateCharacterData({ id: character._id, data: { resilience: 2 } }),
			) ?? [],
		)
	})

	return (
		<ConfirmDialog
			title="Reset Resilience"
			description="This will reset the resilience of all characters to 2. Are you sure?"
			confirmText="Yes, reset resilience"
			onConfirm={resetResilience}
		>
			<Button
				appearance="solid"
				icon={LucideRotateCw}
				pending={resetResilienceState.isLoading}
				pendingIcon={LucideRotateCw}
			>
				Reset Resilience
			</Button>
		</ConfirmDialog>
	)
}
