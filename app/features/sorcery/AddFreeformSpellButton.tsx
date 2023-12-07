import { api } from "convex/_generated/api.js"
import type { Doc, Id } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { LucideWand2 } from "lucide-react"
import { type ComponentPropsWithoutRef, useState } from "react"
import { z } from "zod"
import { Button } from "~/components/Button.tsx"
import { CounterInputUncontrolledField } from "~/components/CounterInput.tsx"
import {
	Dialog,
	DialogTrigger,
	SimpleDialogContent,
} from "~/components/Dialog.tsx"
import { FieldErrors } from "~/components/Field.tsx"
import { Form } from "~/components/Form.tsx"
import { InputField } from "~/components/Input.tsx"
import { PopoverTrigger } from "~/components/Popover.tsx"
import { SelectField, SelectItem } from "~/components/Select.tsx"
import { TextAreaField } from "~/components/TextArea.tsx"
import { compareKey } from "~/helpers/collections.ts"
import { useForm } from "~/helpers/useForm.tsx"
import { getAttributeById } from "../characters/attributes.ts"
import {
	type SorcerySpellAttributeId,
	sorcerySpellAttributeIdSchema,
} from "./spells.ts"

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
	const [attributeId, setAttributeId] = useState<SorcerySpellAttributeId>()

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
		<Form className="@container" onSubmit={form.submit}>
			<div className="grid auto-cols-fr gap-4 @sm:grid-flow-col">
				<InputField {...form.textInputProps("name")} label="Name" />

				<SelectField
					{...form.inputProps("attributeId")}
					label="Attribute"
					value={attributeId}
					setValue={(value) => {
						setAttributeId(sorcerySpellAttributeIdSchema.parse(value))
					}}
					buttonContent={
						attributeId ?
							getAttributeById(attributeId).name
						:	"Select Attribute"
					}
				>
					{sorcerySpellAttributeIdSchema.options
						.map(getAttributeById)
						.toSorted(compareKey("name"))
						.map((attribute) => (
							<SelectItem key={attribute.id} value={attribute.id}>
								{attribute.name}
							</SelectItem>
						))}
				</SelectField>
			</div>

			<TextAreaField
				{...form.textInputProps("description")}
				label="Description"
				expands
			/>

			<TextAreaField
				{...form.textInputProps("amplifiedDescription")}
				label="Amplified Description"
				expands
			/>

			<div className="grid auto-cols-fr gap-4 @sm:grid-flow-col">
				<CounterInputUncontrolledField
					{...form.numberInputProps("manaCost")}
					label="Mana Cost"
					min={1}
				/>

				<CounterInputUncontrolledField
					{...form.numberInputProps("stressCost")}
					label="Stress Cost"
					min={0}
				/>

				<CounterInputUncontrolledField
					{...form.numberInputProps("castingTime")}
					label="Casting Time"
					min={0}
				/>
			</div>

			<Button
				type="submit"
				icon={{ start: LucideWand2 }}
				pending={form.isSubmitting}
			>
				Save
			</Button>

			{form.hasErrors && (
				<FieldErrors
					className="text-center"
					errors={
						form.formErrors?.length ?
							form.formErrors
						:	"Something went wrong. Check for issues and try again."
					}
				/>
			)}
		</Form>
	)
}
