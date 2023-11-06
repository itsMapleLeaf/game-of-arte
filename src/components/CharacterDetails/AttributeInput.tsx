import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { LucideDices } from "lucide-react"
import { startTransition, useState } from "react"
import { twMerge } from "tailwind-merge"
import { raise } from "../../helpers/errors.ts"
import { clamp, toFiniteNumberOrUndefined } from "../../helpers/index.ts"
import { useAppParams } from "../../helpers/useAppParams.ts"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"
import { withPreventDefault } from "../../helpers/withPreventDefault.ts"
import { solidButton } from "../../styles/button.ts"
import { input } from "../../styles/index.ts"
import { CounterInput, type CounterInputProps } from "../CounterInput.tsx"
import {
	Field,
	FieldInput,
	FieldLabel,
	FieldLabelText,
	FieldLabelTooltip,
} from "../Field.tsx"
import { LoadingSpinner } from "../LoadingPlaceholder.tsx"
import { Popover, PopoverPanel, PopoverTrigger } from "../Popover.tsx"
import { useCharacterDataValue } from "./useCharacterDataValue.ts"

export function AttributeInput({
	character,
	dataKey,
	attributeName,
	attributeDescription,
	stressModifier,
	isArchetypeAttribute,
	editable,
	...props
}: CounterInputProps & {
	character: Doc<"characters">
	dataKey: string
	attributeName: string
	attributeDescription: string
	stressModifier: number
	isArchetypeAttribute: boolean
	editable: boolean
}) {
	const [valueRaw, setValue] = useCharacterDataValue(character, dataKey)
	const value = clamp(toFiniteNumberOrUndefined(valueRaw) ?? 1, 1, 5)
	const [popoverOpen, setPopoverOpen] = useState(false)
	return (
		<Field>
			<div
				className={twMerge(
					"transition-colors",
					value > 1 ? "text-accent-400" : "",
				)}
			>
				<FieldLabelTooltip content={attributeDescription}>
					<FieldLabelText>{attributeName}</FieldLabelText>
				</FieldLabelTooltip>
			</div>
			<div className="flex items-center gap-2">
				<div className="flex-1">
					{editable ? (
						<CounterInput
							{...props}
							value={value}
							onChange={setValue}
							min={1}
							max={5}
						/>
					) : (
						<p className={input("text-center tabular-nums")}>
							{value}
							<span className="opacity-50">/5</span>
						</p>
					)}
				</div>
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<PopoverTrigger
						type="button"
						className="rounded-md p-2 transition hover:bg-base-800"
					>
						<LucideDices />
					</PopoverTrigger>
					<PopoverPanel side="bottom" align="center">
						<AttributeRollForm
							character={character}
							attributeName={attributeName}
							attributeValue={toFiniteNumberOrUndefined(value) ?? 1}
							stressModifier={stressModifier}
							isArchetypeAttribute={isArchetypeAttribute}
							onSuccess={() => {
								setPopoverOpen(false)
							}}
						/>
					</PopoverPanel>
				</Popover>
			</div>
		</Field>
	)
}

function AttributeRollForm({
	character,
	attributeName,
	attributeValue,
	stressModifier,
	isArchetypeAttribute,
	onSuccess,
}: {
	character: Doc<"characters">
	attributeName: string
	attributeValue: number
	stressModifier: number
	isArchetypeAttribute: boolean
	onSuccess: () => void
}) {
	const appParams = useAppParams()
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

	const defaultLabel = [
		`${character.name}: ${attributeName}`,
		isModified && `(${formatSigned(totalModifier)})`,
	]
		.filter(Boolean)
		.join(" ")

	const [handleSubmit, handleSubmitState] = useAsyncCallback(
		async function handleSubmit() {
			await roll({
				label: label || defaultLabel,
				type: "action",
				dice: [{ count: diceCount, sides: 12 }],
				characterId: character._id,
			})
			await updateCharacterData({
				id: character._id,
				data: { resilience: availableResilience - resilienceToUse },
			})
			onSuccess()
			startTransition(() => {
				appParams.tab.push("dice")
			})
		},
	)

	const modifierReceiptItems = [{ name: "Base Roll", value: baseDiceCount }]
	if (stressModifier !== 0) {
		modifierReceiptItems.push({ name: "Stress", value: stressModifier })
	}
	if (isArchetypeAttribute) {
		modifierReceiptItems.push({ name: "Archetype", value: 2 })
	}
	if (modifier !== 0) {
		modifierReceiptItems.push({ name: "Manual", value: modifier })
	}
	if (resilienceToUse > 0) {
		modifierReceiptItems.push({ name: "Resilience", value: resilienceToUse })
	}

	return (
		<form
			onSubmit={withPreventDefault(handleSubmit)}
			className="grid w-56 gap-2 p-2"
		>
			<Field>
				<FieldLabel>Label</FieldLabel>
				<FieldInput
					className={input()}
					placeholder={defaultLabel}
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

			{modifierReceiptItems.length > 0 && (
				<dl className="tabular-nums">
					{modifierReceiptItems.map(({ name, value }) => (
						<div key={name} className="flex flex-row gap-1">
							<dt className="flex-1 opacity-70">{name}</dt>
							<dd>{formatSigned(value)}</dd>
						</div>
					))}
				</dl>
			)}

			<button type="submit" className={solidButton()}>
				{handleSubmitState.isLoading ? <LoadingSpinner /> : <LucideDices />}{" "}
				Roll {diceCount} {diceCount === 1 ? "die" : "dice"}
			</button>
		</form>
	)
}

function formatSigned(number: number) {
	return number >= 0 ? `+${number}` : `${number}`
}
