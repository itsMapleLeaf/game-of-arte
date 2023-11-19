import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { LucideDices } from "lucide-react"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { clamp } from "~/helpers/math.ts"
import {
	CounterInput,
	type CounterInputProps,
} from "../../components/CounterInput.tsx"
import {
	Field,
	FieldDescription,
	FieldInput,
	FieldLabel,
	FieldLabelText,
	FieldLabelTooltip,
} from "../../components/Field.tsx"
import { LoadingSpinner } from "../../components/LoadingPlaceholder.tsx"
import {
	Popover,
	PopoverPanel,
	PopoverTrigger,
} from "../../components/Popover.tsx"
import { raise } from "../../helpers/errors.ts"
import { toFiniteNumberOrUndefined } from "../../helpers/index.ts"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"
import { withPreventDefault } from "../../helpers/withPreventDefault.ts"
import { solidButton } from "../../styles/button.ts"
import { input } from "../../styles/index.ts"
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
	const roll = useMutation(api.diceRolls.roll)
	const updateCharacterData = useMutation(api.characters.updateData)
	const [label, setLabel] = useState("")
	const [resilienceToUse, setResilienceToUse] = useState(0)
	const [modifier, setModifier] = useState(0)
	const [secret, setSecret] = useState(false)

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
				secret,
			})
			await updateCharacterData({
				id: character._id,
				data: { resilience: availableResilience - resilienceToUse },
			})
			onSuccess()
		},
	)

	return (
		<form
			onSubmit={withPreventDefault(handleSubmit)}
			className="grid w-64 gap-3 p-2"
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

			<Field>
				<FieldLabel className="flex items-center gap-2">
					Secret{" "}
					<FieldInput
						type="checkbox"
						checked={secret}
						onChange={(event) => {
							setSecret(event.currentTarget.checked)
						}}
						className="accent-accent-500 s-4"
					/>
				</FieldLabel>
				<FieldDescription>Only you and the GM will see this.</FieldDescription>
			</Field>

			<dl className="tabular-nums">
				<ReceiptItem name="Base Roll" value={baseDiceCount} />
				{isArchetypeAttribute && (
					<ReceiptItem name="Archetype" value={formatSigned(2)} />
				)}
				{stressModifier !== 0 && (
					<ReceiptItem name="Stress" value={formatSigned(stressModifier)} />
				)}
				{resilienceToUse > 0 && (
					<ReceiptItem
						name="Resilience"
						value={formatSigned(resilienceToUse)}
					/>
				)}
				{modifier !== 0 && (
					<ReceiptItem name="Manual" value={formatSigned(modifier)} />
				)}
			</dl>

			<button type="submit" className={solidButton()}>
				{handleSubmitState.isLoading ? <LoadingSpinner /> : <LucideDices />}{" "}
				Roll {diceCount} {diceCount === 1 ? "die" : "dice"}{" "}
				{secret && "(secretly)"}
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
