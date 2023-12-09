import { api } from "convex/_generated/api.js"
import type { Doc, Id } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { LucideWand2 } from "lucide-react"
import { type ComponentPropsWithoutRef, useState } from "react"
import { z } from "zod"
import { CounterInputUncontrolledField } from "~/components/CounterInput.tsx"
import {
	Dialog,
	DialogTrigger,
	SimpleDialogContent,
} from "~/components/Dialog.tsx"
import { Input } from "~/components/Input.tsx"
import { PopoverTrigger } from "~/components/Popover.tsx"
import { Select } from "~/components/Select.tsx"
import { Form, FormButton, FormField, useForm } from "~/components/form.tsx"
import { getAttributeById } from "../characters/attributes.ts"
import { sorcerySpellAttributeIdSchema } from "./spells.ts"

export function AddFreeformSpellButton({
	character,
	...props
}: ComponentPropsWithoutRef<typeof PopoverTrigger> & {
	character: Doc<"characters">
}) {
	const [open, setOpen] = useState(false)
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger {...props} />
			<SimpleDialogContent title="Add Freeform Spell">
				<FreeformSpellForm
					character={character}
					onSuccess={() => setOpen(false)}
				/>
			</SimpleDialogContent>
		</Dialog>
	)
}

function FreeformSpellForm({
	character,
	onSuccess,
}: {
	character: {
		_id: Id<"characters">
	}
	onSuccess: () => void
}) {
	const upsertFreeformSpell = useMutation(api.characters.upsertFreeformSpell)

	const form = useForm({
		schema: z.object({
			name: z.string().min(1, "Cannot be empty"),
			description: z.string().min(1, "Cannot be empty"),
			attributeId: z
				.string()
				.transform((it) => (it === "" ? undefined : it))
				.pipe(sorcerySpellAttributeIdSchema),
			amplifiedDescription: z.string().min(1, "Cannot be empty"),
			manaCost: z.coerce.number().int().min(1),
			stressCost: z.coerce.number().int().min(0),
			castingTime: z.coerce.number().int().min(0),
		}),
		async onSubmit(values) {
			await upsertFreeformSpell({
				id: character._id,
				spell: {
					id: crypto.randomUUID(),
					name: values.name,
					attributeId: values.attributeId,
					description: values.description,
					amplifiedDescription: values.amplifiedDescription,
					cost: {
						mana: values.manaCost,
						mentalStress: values.stressCost,
					},
					castingTime: {
						turns: values.castingTime,
					},
				},
			})
			onSuccess()
		},
	})

	return (
		<Form form={form} className="@container">
			<div className="grid auto-cols-fr gap-4 @sm:grid-flow-col">
				<FormField
					name={form.names.name}
					label="Name"
					input={<Input placeholder="Fireball" />}
				/>

				<FormField
					name={form.names.attributeId}
					label="Attribute"
					input={
						<Select
							options={sorcerySpellAttributeIdSchema.options.map((id) => ({
								label: getAttributeById(id).name,
								value: id,
							}))}
						/>
					}
				/>
			</div>

			<FormField
				name={form.names.description}
				label="Description"
				input={<Input placeholder="What does the spell do?" />}
			/>

			<FormField
				name={form.names.amplifiedDescription}
				label="Amplified Description"
				input={<Input placeholder="What does the spell do when amplified?" />}
			/>

			<div className="grid auto-cols-fr gap-4 @sm:grid-flow-col">
				<FormField
					name={form.names.manaCost}
					label="Mana Cost"
					input={<CounterInputUncontrolledField min={1} />}
				/>

				<FormField
					name={form.names.stressCost}
					label="Stress Cost"
					input={<CounterInputUncontrolledField min={0} />}
				/>

				<FormField
					name={form.names.castingTime}
					label="Casting Time"
					input={<CounterInputUncontrolledField min={0} />}
				/>
			</div>

			<FormButton icon={LucideWand2}>Save</FormButton>
		</Form>
	)
}
