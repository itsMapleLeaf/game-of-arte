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
import { useForm } from "~/components/useForm.tsx"
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
			attributeId: sorcerySpellAttributeIdSchema,
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
		<form.Form className="@container">
			<div className="grid auto-cols-fr gap-4 @sm:grid-flow-col">
				<form.Field
					name="name"
					label="Name"
					input={<Input placeholder="Fireball" />}
				/>

				<form.Field
					name="attributeId"
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

			<form.Field
				name="description"
				label="Description"
				input={<Input placeholder="What does the spell do?" />}
			/>

			<form.Field
				name="amplifiedDescription"
				label="Amplified Description"
				input={<Input placeholder="What does the spell do when amplified?" />}
			/>

			<div className="grid auto-cols-fr gap-4 @sm:grid-flow-col">
				<form.Field
					name="manaCost"
					label="Mana Cost"
					input={<CounterInputUncontrolledField min={1} />}
				/>

				<form.Field
					name="stressCost"
					label="Stress Cost"
					input={<CounterInputUncontrolledField min={0} />}
				/>

				<form.Field
					name="castingTime"
					label="Casting Time"
					input={<CounterInputUncontrolledField min={0} />}
				/>
			</div>

			<form.Button icon={LucideWand2}>Save</form.Button>
		</form.Form>
	)
}
