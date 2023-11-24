import type { DialogTriggerProps } from "@radix-ui/react-dialog"
import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
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
import { type SorcerySpellId, sorcerySpells } from "./data.ts"

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
					sorceryDevice={sorceryDevice}
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
	sorceryDevice,
	onSuccess,
}: {
	character: Doc<"characters">
	sorceryDevice: NonNullable<Doc<"characters">["sorceryDevice"]>
	onSuccess: () => void
}) {
	const world = useQuerySuspense(api.world.get)
	const subtractWorldMana = useMutation(api.world.subtractMana)
	const updateCharacterData = useMutation(api.characters.updateData)

	const [spellId, setSpellId] = useState<SorcerySpellId>()
	const spell = spellId ? sorcerySpells[spellId] : undefined

	const [amplify, setAmplify] = useState(false)

	const worldMana = world.mana ?? 10

	const mentalStress =
		toFiniteNumberOrUndefined(character.data.mentalStress) ?? 0

	const mentalStressCost = (spell?.cost.mentalStress ?? 0) + (amplify ? 1 : 0)
	const finalMentalStress = Math.min(6, mentalStress + mentalStressCost)

	const isAffinity =
		spellId && Object.values(sorceryDevice.affinities ?? {}).includes(spellId)

	return spell == null ?
			<SorcerySpellSelect
				sorceryDevice={sorceryDevice}
				count={1}
				onSubmit={([id]) => setSpellId(id)}
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
								finalMentalStress >= 6 && "text-red-400",
							)}
						>
							Mental Stress:
							<span className="sr-only">from</span>
							<strong>{mentalStress}</strong>
							<LucideArrowRight aria-label="to" className="s-5" />
							<strong>{Math.min(6, finalMentalStress)}</strong>
							{finalMentalStress >= 6 && (
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
					isNonAffinitySpell={!isAffinity}
					stressModifier={-mentalStress}
					defaultLabel={`${character.name}: ${spell.name} (${sorceryAttribute.name})`}
					onSuccess={async () => {
						await Promise.all([
							subtractWorldMana({
								amount: spell.cost.mana ?? 0,
							}).catch(console.error),
							updateCharacterData({
								id: character._id,
								data: {
									mentalStress: Math.min(6, finalMentalStress),
								},
							}).catch(console.error),
						])
						onSuccess()
					}}
				/>

				<button
					type="button"
					className={outlineButton()}
					onClick={() => setSpellId(undefined)}
				>
					<LucideChevronLeft /> Back
				</button>

				<aside className="text-center text-sm opacity-75">
					Spell costs will be applied automatically after rolling.
				</aside>
			</div>
}
