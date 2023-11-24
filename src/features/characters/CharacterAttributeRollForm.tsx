import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { LucideDices } from "lucide-react"
import { useState } from "react"
import { CounterInput } from "../../components/CounterInput.tsx"
import {
	Field,
	FieldInput,
	FieldLabel,
	FieldLabelText,
} from "../../components/Field.tsx"
import { LoadingSpinner } from "../../components/LoadingPlaceholder.tsx"
import { raise } from "../../helpers/errors.ts"
import { toFiniteNumberOrUndefined } from "../../helpers/index.ts"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"
import { withPreventDefault } from "../../helpers/withPreventDefault.ts"
import { solidButton } from "../../styles/button.ts"
import { input } from "../../styles/index.ts"

export function CharacterAttributeRollForm({
	character,
	// biome-ignore lint/correctness/noUnusedVariables: bugged
	attributeName,
	attributeValue,
	stressModifier,
	isArchetypeAttribute,
	defaultLabel = `${character.name}: ${attributeName}`,
	onSuccess,
}: {
	character: Doc<"characters">
	attributeName: string
	attributeValue: number
	stressModifier: number
	isArchetypeAttribute: boolean
	defaultLabel?: string
	onSuccess: () => void
}) {
	const roll = useMutation(api.diceRolls.roll)
	const updateCharacterData = useMutation(api.characters.updateData)
	const [label, setLabel] = useState("")
	const [resilienceToUse, setResilienceToUse] = useState(0)
	const [modifier, setModifier] = useState(0)

	const availableResilience =
		toFiniteNumberOrUndefined(character.data.resilience) ?? 0

	const totalModifier =
		modifier + resilienceToUse + stressModifier + (isArchetypeAttribute ? 2 : 0)

	const baseDiceCount =
		{
			1: 1,
			2: 2,
			3: 4,
			4: 7,
			5: 12,
		}[attributeValue] ?? raise(`Invalid attribute value ${attributeValue}`)

	const diceCount = Math.max(baseDiceCount + totalModifier, 1)

	const isModified =
		modifier !== 0 || resilienceToUse !== 0 || stressModifier !== 0

	const fallbackLabel = [
		defaultLabel,
		isModified && `(${formatSigned(totalModifier)})`,
	]
		.filter(Boolean)
		.join(" ")

	const [handleSubmit, handleSubmitState] = useAsyncCallback(
		async function handleSubmit() {
			await roll({
				label: label || fallbackLabel,
				type: "action",
				dice: [{ count: diceCount, sides: 12 }],
				characterId: character._id,
			})
			await updateCharacterData({
				id: character._id,
				data: { resilience: availableResilience - resilienceToUse },
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
					placeholder={fallbackLabel}
					value={label}
					onChange={(event) => {
						setLabel(event.currentTarget.value)
					}}
				/>
			</Field>

			<Field>
				<FieldLabelText>Modifier</FieldLabelText>
				<CounterInput value={modifier} onChange={setModifier} />
			</Field>

			{availableResilience > 0 && (
				<Field>
					<FieldLabelText>Use Resilience</FieldLabelText>
					<CounterInput
						min={0}
						max={availableResilience}
						value={resilienceToUse}
						onChange={setResilienceToUse}
					/>
				</Field>
			)}

			<dl className="tabular-nums">
				<ReceiptItem name="Base Roll" value={baseDiceCount} />
				{stressModifier !== 0 && (
					<ReceiptItem name="Stress" value={formatSigned(stressModifier)} />
				)}
				{isArchetypeAttribute && (
					<ReceiptItem name="Archetype" value={formatSigned(2)} />
				)}
				{modifier !== 0 && (
					<ReceiptItem name="Manual" value={formatSigned(modifier)} />
				)}
				{resilienceToUse > 0 && (
					<ReceiptItem
						name="Resilience"
						value={formatSigned(resilienceToUse)}
					/>
				)}
			</dl>

			<button type="submit" className={solidButton()}>
				{handleSubmitState.isLoading ?
					<LoadingSpinner />
				:	<LucideDices />}{" "}
				Roll {diceCount} {diceCount === 1 ? "die" : "dice"}
			</button>
		</form>
	)
}

function ReceiptItem({
	name,
	value,
}: {
	name: React.ReactNode
	value: React.ReactNode
}) {
	return (
		<div className="flex flex-row gap-1">
			<dt className="flex-1 opacity-70">{name}</dt>
			<dd>{value}</dd>
		</div>
	)
}

function formatSigned(number: number) {
	return number >= 0 ? `+${number}` : `${number}`
}
