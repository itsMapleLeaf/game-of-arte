import type { DialogTriggerProps } from "@radix-ui/react-dialog"
import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel"
import {
	LucideAlertTriangle,
	LucideArrowRight,
	LucideChevronLeft,
} from "lucide-react"
import { useState } from "react"
import {
	Dialog,
	DialogTrigger,
	SimpleDialogContent,
} from "~/components/Dialog.tsx"
import {
	Field,
	FieldDescription,
	FieldInput,
	FieldLabel,
} from "~/components/Field.tsx"
import { expectNonNil } from "~/helpers/errors.ts"
import { toFiniteNumberOrUndefined } from "~/helpers/index.ts"
import { useQuerySuspense } from "~/helpers/useQuerySuspense.ts"
import { outlineButton } from "~/styles/button.ts"
import { checkbox } from "~/styles/index.ts"
import { twMerge } from "~/styles/twMerge.ts"
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
	const world = useQuerySuspense(api.world.get)
	const [spell, setSpell] = useState<SorcerySpell>()
	const [amplify, setAmplify] = useState(false)

	const worldMana = world.mana ?? 10

	const mentalStress =
		toFiniteNumberOrUndefined(character.data.mentalStress) ?? 0

	const mentalStressCost = (spell?.cost.mentalStress ?? 0) + (amplify ? 1 : 0)

	return spell == null ?
			<SorcerySpellSelect
				count={1}
				onSubmit={([spell]) => {
					setSpell(sorcerySpells[expectNonNil(spell)])
				}}
			/>
		:	<div className="grid gap-4">
				<section className="text-center" aria-label="Spell Details">
					<h3 className="text-xl font-light">{spell.name}</h3>
					<p className="mb-3 [text-wrap:balance]">{spell.description}</p>

					<p
						className={twMerge(
							"flex items-center justify-center gap-1 transition",
							worldMana <= spell.cost.mana && "text-yellow-400",
							worldMana === 0 && "text-red-400",
						)}
					>
						Mana:
						<span className="sr-only">from</span>
						<strong>{worldMana}</strong>
						<LucideArrowRight aria-label="to" className="s-5" />
						<strong>{Math.max(0, worldMana - spell.cost.mana)}</strong>
						{worldMana <= spell.cost.mana && (
							<LucideAlertTriangle className="s-5" />
						)}
					</p>

					{mentalStressCost > 0 && (
						<p
							className={twMerge(
								"flex items-center justify-center gap-1 transition",
								mentalStress + mentalStressCost >= 6 && "text-red-400",
							)}
						>
							Mental Stress:
							<span className="sr-only">from</span>
							<strong>{mentalStress}</strong>
							<LucideArrowRight aria-label="to" className="s-5" />
							<strong>{Math.min(6, mentalStress + mentalStressCost)}</strong>
							{mentalStress + mentalStressCost >= 6 && (
								<LucideAlertTriangle className="s-5" />
							)}
						</p>
					)}
				</section>

				<Field>
					<div className="flex flex-row items-center gap-2">
						<FieldLabel>Amplify</FieldLabel>
						<FieldInput
							type="checkbox"
							checked={amplify}
							className={checkbox()}
							onChange={(event) => setAmplify(event.target.checked)}
						/>
					</div>
					<FieldDescription>
						When amplified: {spell.amplifiedDescription}
					</FieldDescription>
				</Field>

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
					stressModifier={-mentalStress}
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
			</div>
}
