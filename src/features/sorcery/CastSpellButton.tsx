import type { DialogTriggerProps } from "@radix-ui/react-dialog"
import type { Doc } from "convex/_generated/dataModel"
import { LucideChevronLeft } from "lucide-react"
import { useState } from "react"
import {
	Dialog,
	DialogTrigger,
	SimpleDialogContent,
} from "~/components/Dialog.tsx"
import { expectNonNil } from "~/helpers/errors.ts"
import { toFiniteNumberOrUndefined } from "~/helpers/index.ts"
import { outlineButton } from "~/styles/button.ts"
import { CharacterAttributeRollForm } from "../characters/CharacterAttributeRollForm.tsx"
import {
	knowledgeAttributeCategory,
	sorceryAttribute,
} from "../characters/attributes.ts"
import { SorcerySpellSelect } from "./SorcerySpellSelect.tsx"
import { type SorcerySpell, sorcerySpells } from "./data.ts"

export function CastSpellButton({
	character,
	sorceryDevice,
	...props
}: DialogTriggerProps & {
	character: Doc<"characters">
	sorceryDevice: NonNullable<Doc<"characters">["sorceryDevice"]>
}) {
	const [open, setOpen] = useState(false)
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger {...props} />
			<SimpleDialogContent title="Cast Spell">
				<CastSpellForm
					character={character}
					onSuccess={() => {
						setOpen(false)
					}}
				/>
			</SimpleDialogContent>
		</Dialog>
	)
}

function CastSpellForm({
	character,
	onSuccess,
}: {
	character: Doc<"characters">
	onSuccess: () => void
}) {
	const [spell, setSpell] = useState<SorcerySpell>()
	return spell == null ?
			<SorcerySpellSelect
				count={1}
				onSubmit={([spell]) => {
					setSpell(sorcerySpells[expectNonNil(spell)])
				}}
			/>
		:	<>
				<p className="text-center text-xl font-light">
					<strong>{spell.name}</strong>
				</p>
				<CharacterAttributeRollForm
					character={character}
					attributeName={sorceryAttribute.name}
					attributeValue={
						toFiniteNumberOrUndefined(
							character.data[sorceryAttribute.dataKey],
						) ?? 1
					}
					isArchetypeAttribute={
						character.data.archetype === knowledgeAttributeCategory.archetypeId
					}
					stressModifier={
						toFiniteNumberOrUndefined(character.data.mentalStress) ?? 0
					}
					defaultLabel={`${character.name}: ${spell.name} (${sorceryAttribute.name})`}
					onSuccess={onSuccess}
				/>
				<button
					type="button"
					className={outlineButton()}
					onClick={() => {
						setSpell(undefined)
					}}
				>
					<LucideChevronLeft /> Back
				</button>
			</>
}
