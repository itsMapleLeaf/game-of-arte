import { api } from "convex/_generated/api.js"
import { useMutation } from "convex/react"
import { LucideDices, LucidePentagon, LucideTriangle } from "lucide-react"
import { type ReactNode, useState } from "react"
import { plural } from "~/helpers/index.ts"
import { sum } from "~/helpers/math.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { CounterInput } from "../../components/CounterInput.tsx"
import {
	Field,
	FieldInput,
	FieldLabel,
	FieldLabelText,
} from "../../components/Field.tsx"
import { LoadingSpinner } from "../../components/LoadingPlaceholder.tsx"
import { raise } from "../../helpers/errors.ts"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"
import { withPreventDefault } from "../../helpers/withPreventDefault.ts"
import { solidButton } from "../../styles/button.ts"
import { input } from "../../styles/index.ts"
import { ACTION_DICE_SIDES, MODIFIER_DICE_SIDES } from "../dice/constants.ts"
import { CharacterContext } from "./CharacterContext.tsx"
import { type Attribute, attributeCategories } from "./attributes.ts"
import { DICE_COUNT_BY_LEVEL } from "./constants.ts"
import { parseCharacterData } from "./data.ts"

export function CharacterAttributeRollForm({
	attribute,
	defaultLabel,
	extraBoostDiceItems = [],
	extraSnagDiceItems = [],
	onSuccess,
}: {
	attribute: Attribute
	defaultLabel?: string
	extraBoostDiceItems?: { label: string; value: number }[]
	extraSnagDiceItems?: { label: string; value: number }[]
	onSuccess: () => void
}) {
	const character = CharacterContext.useValue()
	const characterData = parseCharacterData(character.data)

	const roll = useMutation(api.diceRolls.roll)
	const updateCharacterData = useMutation(api.characters.updateData)

	const [label, setLabel] = useState("")
	const [resilienceToUse, setResilienceToUse] = useState(0)
	const [additionalBoostDice, setAdditionalBoostDice] = useState(0)
	const [additionalSnagDice, setAdditionalSnagDice] = useState(0)

	const characterAttributeValue = characterData[attribute.dataKey]

	const attributeCategory =
		attributeCategories.find((cat) => cat.attributes.includes(attribute)) ??
		raise(`No category found for attribute ${attribute.name}`)

	const isArchetypeAttribute =
		characterData.archetype === attributeCategory.archetypeId

	const baseDiceCount =
		DICE_COUNT_BY_LEVEL[characterAttributeValue] ??
		raise(`Invalid attribute value ${characterAttributeValue}`)

	const stress =
		characterData[
			attributeCategory.id === "physical" ? "physicalStress" : "mentalStress"
		]

	const boostDiceItems = [
		{ label: "Archetype", value: isArchetypeAttribute ? 1 : 0 },
		{ label: "Resilience", value: resilienceToUse },
		...extraBoostDiceItems,
		{ label: "Extra Boost Dice", value: additionalBoostDice },
	].filter((item) => item.value > 0)
	const boostDiceCount = sum(boostDiceItems.map((item) => item.value))

	const snagDiceItems = [
		{ label: "Stress", value: stress },
		...extraSnagDiceItems,
		{ label: "Extra Snag Dice", value: additionalSnagDice },
	].filter((item) => item.value > 0)
	const snagDiceCount = sum(snagDiceItems.map((item) => item.value))

	const diceCount = baseDiceCount + boostDiceCount + snagDiceCount

	const labelPlaceholder =
		defaultLabel ?? `${character.name}: ${attribute.name}`

	const [handleSubmit, handleSubmitState] = useAsyncCallback(
		async function handleSubmit() {
			await roll({
				label: label || labelPlaceholder,
				type: "action",
				dice: [
					{
						count: diceCount,
						sides: ACTION_DICE_SIDES,
					},
					...boostDiceItems.map((item) => ({
						count: item.value,
						sides: MODIFIER_DICE_SIDES,
					})),
					...snagDiceItems.map((item) => ({
						count: item.value,
						sides: MODIFIER_DICE_SIDES,
					})),
				],
				characterId: character._id,
			})
			await updateCharacterData({
				id: character._id,
				data: { resilience: characterData.resilience - resilienceToUse },
			})
			onSuccess()
		},
	)

	return (
		<form onSubmit={withPreventDefault(handleSubmit)} className="grid gap-4">
			<Field>
				<FieldLabel>Label</FieldLabel>
				<FieldInput
					className={input()}
					placeholder={labelPlaceholder}
					value={label}
					onChange={(event) => {
						setLabel(event.currentTarget.value)
					}}
				/>
			</Field>

			<Field>
				<FieldLabelText>Boost Dice</FieldLabelText>
				<CounterInput
					value={additionalBoostDice}
					onChange={setAdditionalBoostDice}
				/>
			</Field>

			<Field>
				<FieldLabelText>Snag Dice</FieldLabelText>
				<CounterInput
					value={additionalSnagDice}
					onChange={setAdditionalSnagDice}
				/>
			</Field>

			{characterData.resilience > 0 && (
				<Field>
					<FieldLabelText>Use Resilience</FieldLabelText>
					<CounterInput
						min={0}
						max={characterData.resilience}
						value={resilienceToUse}
						onChange={setResilienceToUse}
					/>
				</Field>
			)}

			<dl className="flex flex-col gap-1 tabular-nums">
				<ReceiptItem
					name="Base Roll"
					value={baseDiceCount}
					icon={<LucidePentagon className="s-5" />}
				/>
				{boostDiceItems.map((item) => (
					<ReceiptItem
						key={item.label}
						name={item.label}
						value={item.value}
						icon={<LucideTriangle className="s-5" />}
						className="text-green-400"
					/>
				))}
				{snagDiceItems.map((item) => (
					<ReceiptItem
						key={item.label}
						name={item.label}
						value={item.value}
						icon={<LucideTriangle className="s-5" />}
						className="text-red-400"
					/>
				))}
			</dl>

			<button type="submit" className={solidButton()}>
				{handleSubmitState.isLoading ?
					<LoadingSpinner />
				:	<LucideDices />}{" "}
				Roll {plural(diceCount, "Die", { pluralWord: "Dice" })}
			</button>
		</form>
	)
}

function ReceiptItem({
	name,
	value,
	className,
	icon,
}: {
	name: React.ReactNode
	value: React.ReactNode
	className?: string
	icon: ReactNode
}) {
	return (
		<div className={twMerge("flex flex-row", className)}>
			<dt className="flex-1">{name}</dt>
			<dd className="flex items-center gap-1">
				{value}
				{icon}
			</dd>
		</div>
	)
}
