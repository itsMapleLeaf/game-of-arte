import { api } from "convex/_generated/api.js"
import type { Doc, Id } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { LucideWand2 } from "lucide-react"
import { type ComponentPropsWithoutRef, useState } from "react"
import { z } from "zod"
import { CounterInput } from "~/ui/CounterInput.tsx"
import { Dialog, DialogTrigger, SimpleDialogContent } from "~/ui/Dialog.tsx"
import { Input } from "~/ui/Input.tsx"
import { PopoverTrigger } from "~/ui/Popover.tsx"
import { Select } from "~/ui/Select.tsx"
import { TextArea } from "~/ui/TextArea.tsx"
import { Form, FormButton, FormField, useForm } from "~/ui/form.tsx"
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
			name: z.string().min(1, "Cannot be empty").default(""),
			description: z.string().min(1, "Cannot be empty").default(""),
			attributeId: z
				.string()
				.transform((it) => (it === "" ? undefined : it))
				.pipe(sorcerySpellAttributeIdSchema),
			amplifiedDescription: z.string().min(1, "Cannot be empty").default(""),
			manaCost: z.number().int().min(1).default(1),
			stressCost: z.number().int().min(0).default(0),
			castingTime: z.number().int().min(0).default(0),
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
		<Form state={form} className="@container">
			<div className="grid auto-cols-fr gap-4 @sm:grid-flow-col">
				<FormField name={form.names.name} label="Name">
					<Input placeholder="Fireball" />
				</FormField>

				<FormField name={form.names.attributeId} label="Attribute">
					<Select
						options={sorcerySpellAttributeIdSchema.options.map((id) => ({
							label: getAttributeById(id).name,
							value: id,
						}))}
					/>
				</FormField>
			</div>

			<FormField name={form.names.description} label="Description">
				<TextArea placeholder="What does the spell do?" />
			</FormField>

			<FormField
				name={form.names.amplifiedDescription}
				label="Amplified Description"
			>
				<TextArea placeholder="What does the spell do when amplified?" />
			</FormField>

			<div className="grid auto-cols-fr gap-4 @sm:grid-flow-col">
				<FormField name={form.names.manaCost} label="Mana Cost">
					<CounterInput min={1} />
				</FormField>

				<FormField name={form.names.stressCost} label="Stress Cost">
					<CounterInput min={0} />
				</FormField>

				<FormField name={form.names.castingTime} label="Casting Time">
					<CounterInput min={0} />
				</FormField>
			</div>

			<FormButton icon={LucideWand2}>Save</FormButton>
		</Form>
	)
}
