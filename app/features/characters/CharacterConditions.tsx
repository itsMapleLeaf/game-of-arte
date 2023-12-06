import type { PopoverTriggerProps } from "@radix-ui/react-popover"
import { api } from "convex/_generated/api"
import type { Condition } from "convex/characters.validators.ts"
import { useMutation } from "convex/react"
import { LucideCheck, LucideEdit, LucidePlus, LucideX } from "lucide-react"
import { useState } from "react"
import { z } from "zod"
import { Button } from "~/components/Button.tsx"
import { CounterInput } from "~/components/CounterInput.tsx"
import { Field, FieldErrors, FieldInput } from "~/components/Field.tsx"
import { Popover, PopoverPanel, PopoverTrigger } from "~/components/Popover.tsx"
import { SrOnly } from "~/components/SrOnly.tsx"
import { input } from "~/styles/index.ts"
import { panel } from "~/styles/panel.ts"
import { useForm } from "../../helpers/useForm.tsx"
import { CharacterContext } from "./CharacterContext.tsx"
import { MentalStressIndicator } from "./MentalStressIndicator.tsx"
import { PhysicalStressIndicator } from "./PhysicalStressIndicator.tsx"

export function CharacterConditions() {
	const character = CharacterContext.useValue()

	return (
		<div className="grid gap-2">
			<ul className="flex flex-col gap-1">
				{character.conditions?.map((condition) => (
					<li key={condition.id}>
						<CharacterConditionItem condition={condition} />
					</li>
				))}
			</ul>

			<ConditionFormButton asChild>
				<Button appearance="outline" icon={{ start: LucidePlus }}>
					Add Condition
				</Button>
			</ConditionFormButton>
		</div>
	)
}

function CharacterConditionItem({ condition }: { condition: Condition }) {
	const removeCondition = useRemoveCondition(condition)
	return (
		<div className="flex gap-3">
			<div className={panel("flex flex-1 rounded-md border")}>
				<p className="flex-1 self-center px-2 py-1.5">
					{condition.description || (
						<span className="italic opacity-75">No description.</span>
					)}
				</p>
				<div className="flex items-center gap-2 px-2">
					{condition.physicalStress > 0 && (
						<PhysicalStressIndicator value={condition.physicalStress} />
					)}
					{condition.mentalStress > 0 && (
						<MentalStressIndicator value={condition.mentalStress} />
					)}
				</div>
			</div>

			<ConditionFormButton initialCondition={condition} asChild>
				<Button
					appearance="faded"
					icon={{ start: LucideEdit }}
					square
					className="-mx-2 min-h-8"
				>
					<SrOnly>Edit</SrOnly>
				</Button>
			</ConditionFormButton>

			<Button
				appearance="faded"
				icon={{ start: LucideX }}
				square
				className="-mx-2 min-h-8"
				onClick={removeCondition}
			>
				<SrOnly>Remove</SrOnly>
			</Button>
		</div>
	)
}

function ConditionFormButton({
	initialCondition,
	...props
}: PopoverTriggerProps & {
	initialCondition?: Condition
}) {
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger {...props} />
			<PopoverPanel>
				<ConditionForm
					initialCondition={initialCondition}
					onSuccess={() => setOpen(false)}
				/>
			</PopoverPanel>
		</Popover>
	)
}

function ConditionForm({
	initialCondition,
	onSuccess,
}: {
	initialCondition?: Condition
	onSuccess: () => void
}) {
	const character = CharacterContext.useValue()
	const upsertCondition = useMutation(api.characters.upsertCondition)

	const form = useForm({
		schema: z
			.object({
				description: z.string().min(1, "Cannot be empty").default(""),
				physicalStress: z.number().int().min(0),
				mentalStress: z.number().int().min(0),
			})
			.refine(
				(data) => {
					const totalStress = data.physicalStress + data.mentalStress
					return totalStress > 0
				},
				{
					message: "Must have at least 1 stress",
				},
			),
		defaultValues: {
			physicalStress: 0,
			mentalStress: 0,
			...initialCondition,
		},
		onSubmit: async (values) => {
			await upsertCondition({
				id: character._id,
				condition: {
					...values,
					id: initialCondition?.id || crypto.randomUUID(),
				},
			})
			onSuccess()
		},
	})

	return (
		<form onSubmit={form.submit} className="grid w-64 grid-cols-2 gap-3 p-3">
			<Field
				label="Description"
				errors={form.fieldErrors?.description}
				className="col-span-2"
			>
				<FieldInput
					{...form.textInputProps("description")}
					className={input()}
					placeholder="What happened?"
				/>
			</Field>
			<Field label="Phys. Stress" errors={form.fieldErrors?.physicalStress}>
				<FieldInput asChild>
					<CounterInput {...form.numberInputProps("physicalStress")} min={0} />
				</FieldInput>
			</Field>
			<Field label="Ment. Stress" errors={form.fieldErrors?.mentalStress}>
				<FieldInput asChild>
					<CounterInput {...form.numberInputProps("mentalStress")} min={0} />
				</FieldInput>
			</Field>

			<div className="col-span-2">
				<Button
					type="submit"
					className="w-full"
					icon={{ start: LucideCheck }}
					pending={form.isSubmitting}
				>
					Submit
				</Button>
			</div>

			<FieldErrors className="col-span-2" errors={form.formErrors} />
		</form>
	)
}

function useRemoveCondition(condition: { id: string }) {
	const character = CharacterContext.useValue()
	const updateCharacter = useMutation(api.characters.update)

	return async function removeCondition() {
		const conditionsById = Object.fromEntries(
			character.conditions?.map((c) => [c.id, c]) ?? [],
		)

		delete conditionsById[condition.id]

		await updateCharacter({
			id: character._id,
			conditions: Object.values(conditionsById),
		})
	}
}
