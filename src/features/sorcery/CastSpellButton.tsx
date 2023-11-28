import type { DialogTriggerProps } from "@radix-ui/react-dialog"
import { api } from "convex/_generated/api.js"
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
import { useQuerySuspense } from "~/helpers/useQuerySuspense.ts"
import { outlineButton } from "~/styles/button.ts"
import { checkbox } from "~/styles/index.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { CharacterAttributeRollForm } from "../characters/CharacterAttributeRollForm.tsx"
import { CharacterContext } from "../characters/CharacterContext.tsx"
import { getAttributeById } from "../characters/attributes.ts"
import { STRESS_MAX } from "../characters/constants.ts"
import { getCharacterStress } from "../characters/data.ts"
import { WORLD_MANA_MAX } from "../worlds/constants.ts"
import { SorcerySpellSelect } from "./SorcerySpellSelect.tsx"
import {
	type SorcerySpell,
	type SorcerySpellId,
	sorcerySpells,
} from "./spells.ts"

export function CastSpellButton(props: DialogTriggerProps) {
	const [open, setOpen] = useState(false)
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger {...props} />
			<SimpleDialogContent title="Cast Spell">
				<CastSpellForm
					onSuccess={() => {
						setOpen(false)
					}}
				/>
			</SimpleDialogContent>
		</Dialog>
	)
}

function CastSpellForm({ onSuccess }: { onSuccess: () => void }) {
	const character = CharacterContext.useValue()

	const world = useQuerySuspense(api.world.get)
	const subtractWorldMana = useMutation(api.world.subtractMana)
	const updateCharacterData = useMutation(api.characters.updateData)

	const [spellId, setSpellId] = useState<SorcerySpellId>()
	const spell = spellId ? sorcerySpells[spellId] : undefined

	const [amplify, setAmplify] = useState(false)

	const worldMana = world.mana ?? WORLD_MANA_MAX

	const { mentalStress } = getCharacterStress(character)

	const mentalStressCost = (spell?.cost.mentalStress ?? 0) + (amplify ? 1 : 0)
	const finalMentalStress = Math.min(
		STRESS_MAX,
		mentalStress + mentalStressCost,
	)
	const stressRisk = finalMentalStress >= 6

	const finalWorldMana = (spell: SorcerySpell) =>
		Math.max(0, worldMana - spell.cost.mana)

	return spell == null ?
			<SorcerySpellSelect count={1} onSubmit={([id]) => setSpellId(id)} />
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
						<strong>{finalWorldMana(spell)}</strong>
						{worldMana <= spell.cost.mana && (
							<LucideAlertTriangle className="s-5" />
						)}
					</p>

					{mentalStressCost > 0 && (
						<p
							className={twMerge(
								"flex items-center justify-center gap-1 transition",
								stressRisk && "text-red-400",
							)}
						>
							Mental Stress:
							<span className="sr-only">from</span>
							<strong>{mentalStress}</strong>
							<LucideArrowRight aria-label="to" className="s-5" />
							<strong>{finalMentalStress}</strong>
							{stressRisk && <LucideAlertTriangle className="s-5" />}
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
					attribute={getAttributeById(spell.attributeId)}
					defaultLabel={`${character.name}: ${
						getAttributeById(spell.attributeId).name
					} - ${spell.name}${amplify ? " (Amplified)" : ""}`}
					onSuccess={async () => {
						await Promise.all([
							subtractWorldMana({
								amount: spell.cost.mana,
							}).catch(console.error),
							updateCharacterData({
								id: character._id,
								data: {
									mentalStress: finalMentalStress,
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
