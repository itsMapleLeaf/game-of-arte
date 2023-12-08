import type { DialogTriggerProps } from "@radix-ui/react-dialog"
import { api } from "convex/_generated/api.js"
import { useMutation, useQuery } from "convex/react"
import {
	LucideAlertTriangle,
	LucideArrowRight,
	LucideChevronLeft,
} from "lucide-react"
import { useLayoutEffect, useState } from "react"
import { Button } from "~/components/Button.tsx"
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
import { Form } from "~/components/Form.tsx"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import { checkbox } from "~/styles/index.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { CharacterAttributeRollForm } from "../characters/CharacterAttributeRollForm.tsx"
import { CharacterContext } from "../characters/CharacterContext.tsx"
import { getAttributeById } from "../characters/attributes.ts"
import { STRESS_MAX } from "../characters/constants.ts"
import {
	getCharacterAttributeValue,
	getCharacterStress,
} from "../characters/data.ts"
import { WORLD_MANA_MAX } from "../worlds/constants.ts"
import { SorcerySpellSelect } from "./SorcerySpellSelect.tsx"
import type { SorcerySpell } from "./spells.ts"

export function CastSpellButton(props: DialogTriggerProps) {
	const [open, setOpen] = useState(false)

	const [spell, setSpell] = useState<SorcerySpell>()

	useLayoutEffect(() => {
		if (open) {
			setSpell(undefined)
		}
	}, [open])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger {...props} />
			<SimpleDialogContent
				title={spell == null ? "Spellbook" : `Casting ${spell.name}`}
				className={spell == null ? "max-w-xl" : "max-w-md"}
			>
				{spell == null ?
					<SorcerySpellSelect onSelect={setSpell} />
				:	<CastSpellForm
						spell={spell}
						onSuccess={() => {
							setOpen(false)
						}}
						onBack={() => {
							setSpell(undefined)
						}}
					/>
				}
			</SimpleDialogContent>
		</Dialog>
	)
}

function CastSpellForm({
	spell,
	onSuccess,
	onBack,
}: {
	spell: SorcerySpell
	onSuccess: () => void
	onBack: () => void
}) {
	const world = useQuery(api.world.get)
	const subtractWorldMana = useMutation(api.world.subtractMana)
	const upsertCondition = useMutation(api.characters.upsertCondition)
	const [amplify, setAmplify] = useState(false)
	const character = CharacterContext.useValue()

	if (!world) {
		return <LoadingPlaceholder />
	}

	const worldMana = world.mana ?? WORLD_MANA_MAX
	const finalWorldMana = Math.max(0, worldMana - spell.cost.mana)

	const { mentalStress } = getCharacterStress(character)
	const mentalStressCost = (spell?.cost.mentalStress ?? 0) + (amplify ? 1 : 0)
	const finalMentalStress = Math.min(
		STRESS_MAX,
		mentalStress + mentalStressCost,
	)
	const stressRisk = finalMentalStress >= 6

	return (
		<Form asChild>
			<div>
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
						<strong>{finalWorldMana}</strong>
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
					} ${getCharacterAttributeValue(character, spell.attributeId)} - ${
						spell.name
					}${amplify ? " (Amplified)" : ""}`}
					onSuccess={async () => {
						await Promise.all([
							subtractWorldMana({
								amount: spell.cost.mana,
							}).catch(console.error),
							mentalStressCost > 0 &&
								upsertCondition({
									id: character._id,
									condition: {
										id: crypto.randomUUID(),
										description: `Sorcery - ${spell.name}`,
										physicalStress: 0,
										mentalStress: mentalStressCost,
									},
								}).catch(console.error),
						])
						onSuccess()
					}}
				/>

				<Button appearance="outline" icon={LucideChevronLeft} onClick={onBack}>
					Back
				</Button>

				<aside className="text-center text-sm opacity-75">
					Spell costs will be applied automatically after rolling.
				</aside>
			</div>
		</Form>
	)
}
