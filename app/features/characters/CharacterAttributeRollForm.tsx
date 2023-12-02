import { api } from "convex/_generated/api.js"
import { useMutation } from "convex/react"
import { LucideDices, LucidePentagon } from "lucide-react"
import { type ReactNode, useState } from "react"
import { CheckboxField } from "~/components/CheckboxField.tsx"
import { sum } from "~/helpers/math.ts"
import { plural } from "~/helpers/string.ts"
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
import { withPreventDefault } from "../../helpers/events.ts"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"
import { solidButton } from "../../styles/button.ts"
import { input } from "../../styles/index.ts"
import type { DiceHint } from "../dice/DiceHint.ts"
import { DieIcon } from "../dice/DieIcon.tsx"
import { ACTION_DICE_SIDES, MODIFIER_DICE_SIDES } from "../dice/constants.ts"
import {
	ACTION_DICE_RULES,
	BOOST_DICE_RULES,
	SNAG_DICE_RULES,
} from "../dice/rules.ts"
import { CharacterContext } from "./CharacterContext.tsx"
import type { Attribute } from "./attributes.ts"
import { ACTION_DICE_COUNT_BY_LEVEL, ARCHETYPE_BONUS } from "./constants.ts"
import {
	getCharacterAttributeValue,
	getCharacterStress,
	parseCharacterData,
} from "./data.ts"

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
	const characterAttributeValue = getCharacterAttributeValue(
		character,
		attribute.id,
	)

	const roll = useMutation(api.diceRolls.roll)
	const updateCharacterData = useMutation(api.characters.updateData)
	const setHints = useMutation(api.diceRolls.setHints)

	const [label, setLabel] = useState("")
	const [resilienceToUse, setResilienceToUse] = useState(0)
	const [additionalBoostDice, setAdditionalBoostDice] = useState(0)
	const [additionalSnagDice, setAdditionalSnagDice] = useState(0)
	const [isSecret, setIsSecret] = useState(false)

	const isArchetypeAttribute = characterData.archetype === attribute.category.id

	const actionDiceCount =
		ACTION_DICE_COUNT_BY_LEVEL[characterAttributeValue] ??
		raise(`Invalid attribute value ${characterAttributeValue}`)

	const { physicalStress, mentalStress } = getCharacterStress(character)

	const boostDiceItems = [
		{ label: "Archetype", value: isArchetypeAttribute ? ARCHETYPE_BONUS : 0 },
		{ label: "Resilience", value: resilienceToUse },
		...extraBoostDiceItems,
		{ label: "Extra Boost Dice", value: additionalBoostDice },
	].filter((item) => item.value > 0)
	const boostDiceCount = sum(boostDiceItems.map((item) => item.value))

	const snagDiceItems = [
		attribute.category.id === "physical" ?
			{ label: "Physical Stress", value: physicalStress }
		:	{ label: "Mental Stress", value: mentalStress },
		...extraSnagDiceItems,
		{ label: "Extra Snag Dice", value: additionalSnagDice },
	].filter((item) => item.value > 0)
	const snagDiceCount = sum(snagDiceItems.map((item) => item.value))

	const diceCount = actionDiceCount + boostDiceCount + snagDiceCount

	const labelPlaceholder =
		defaultLabel ??
		`${character.name}: ${attribute.name} ${characterAttributeValue}`

	const [handleSubmit, handleSubmitState] = useAsyncCallback(
		async function handleSubmit() {
			const result = await roll({
				label: label || labelPlaceholder,
				type: "action",
				dice: [
					{
						count: actionDiceCount,
						sides: ACTION_DICE_SIDES,
						rules: ACTION_DICE_RULES,
					},
					...boostDiceItems.map((item) => ({
						count: item.value,
						sides: MODIFIER_DICE_SIDES,
						rules: BOOST_DICE_RULES,
					})),
					...snagDiceItems.map((item) => ({
						count: item.value,
						sides: MODIFIER_DICE_SIDES,
						rules: SNAG_DICE_RULES,
					})),
				],
				characterId: character._id,
				secret: isSecret,
			})

			await updateCharacterData({
				id: character._id,
				data: { resilience: characterData.resilience - resilienceToUse },
			})

			const successCount = sum(result.dice.map((die) => die.successes ?? 0))
			if (successCount <= 0) {
				const hints: DiceHint[] = ["collectResilience"]
				await setHints({
					rollId: result._id,
					hints,
				})
			}

			onSuccess()
		},
	)

	return (
		<form
			onSubmit={withPreventDefault(handleSubmit)}
			className="grid gap-4 @container"
		>
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

			<div className="contents grid-flow-col gap-2 @sm:grid">
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
			</div>

			<CheckboxField
				label="Secret"
				description={
					isSecret ?
						"Only you and the GM can see this."
					:	"Everyone can see this."
				}
				checked={isSecret}
				onChange={(event) => setIsSecret(event.currentTarget.checked)}
			/>

			<dl className="flex flex-col gap-1 tabular-nums">
				<ReceiptItem
					name="Action Dice"
					value={actionDiceCount}
					icon={<LucidePentagon className="s-5" />}
				/>
				{boostDiceItems.map((item) => (
					<ReceiptItem
						key={item.label}
						name={item.label}
						value={item.value}
						icon={<DieIcon sides={MODIFIER_DICE_SIDES} className="s-5" />}
						className="text-green-400"
					/>
				))}
				{snagDiceItems.map((item) => (
					<ReceiptItem
						key={item.label}
						name={item.label}
						value={item.value}
						icon={<DieIcon sides={MODIFIER_DICE_SIDES} className="s-5" />}
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
