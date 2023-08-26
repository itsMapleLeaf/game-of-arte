import { api } from "convex/_generated/api.js"
import { type Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { LucideDices } from "lucide-react"
import { startTransition, useState } from "react"
import { twMerge } from "tailwind-merge"
import { toFiniteNumberOrUndefined } from "../../helpers/index.ts"
import { useAppParams } from "../../helpers/useAppParams.ts"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"
import { CounterInput, type CounterInputProps } from "../CounterInput.tsx"
import { Field, FieldLabelText, FieldLabelTooltip } from "../Field.tsx"
import {
	Popover,
	PopoverClose,
	PopoverPanel,
	PopoverTrigger,
} from "../Popover.tsx"
import { useCharacterDataValue } from "./useCharacterDataValue.ts"

export function AttributeInput({
	character,
	dataKey,
	attributeName,
	attributeDescription,
	...props
}: CounterInputProps & {
	character: Doc<"characters">
	dataKey: string
	attributeName: string
	attributeDescription: string
}) {
	const [valueRaw, setValue] = useCharacterDataValue(character, dataKey)
	const value = toFiniteNumberOrUndefined(valueRaw) ?? 1
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
					<CounterInput
						{...props}
						value={toFiniteNumberOrUndefined(value) ?? 1}
						onChange={setValue}
						min={1}
					/>
				</div>
				<Popover>
					<PopoverTrigger
						type="button"
						className="rounded-md p-2 transition hover:bg-base-800"
					>
						<LucideDices />
					</PopoverTrigger>
					<PopoverPanel side="bottom" align="center" className="w-48">
						<AttributeRollForm
							character={character}
							attributeName={attributeName}
							attributeValue={toFiniteNumberOrUndefined(value) ?? 1}
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
}: {
	character: Doc<"characters">
	attributeName: string
	attributeValue: number
}) {
	const appParams = useAppParams()
	const roll = useMutation(api.diceRolls.roll)
	const updateCharacterData = useMutation(api.characters.updateData)
	const [resilienceToUse, setResilienceToUse] = useState(0)

	const availableResilience =
		toFiniteNumberOrUndefined(character.data.resilience) ?? 0

	const diceCount = attributeValue + resilienceToUse

	const [submit] = useAsyncCallback(
		async () => {
			await roll({
				label:
					`${character.name}: ${attributeName}` +
					(resilienceToUse > 0 ? ` (+${resilienceToUse})` : ""),
				type: "action",
				dice: [{ count: diceCount, sides: 12 }],
				characterId: character._id,
			})
			await updateCharacterData({
				id: character._id,
				data: { resilience: availableResilience - resilienceToUse },
			})
		},
		{
			onSuccess: () => {
				startTransition(() => {
					appParams.tab.push("dice")
				})
			},
		},
	)

	return (
		<div className="grid gap-2 p-2">
			<Field>
				<FieldLabelText>Use Resilience</FieldLabelText>
				<CounterInput
					min={0}
					max={availableResilience}
					value={resilienceToUse}
					onChange={setResilienceToUse}
				/>
			</Field>
			<PopoverClose
				className="flex items-center gap-2 rounded-md border border-base-800 p-2 transition hover:bg-base-800"
				onClick={submit}
			>
				<LucideDices /> Roll {diceCount} {diceCount === 1 ? "die" : "dice"}
			</PopoverClose>
		</div>
	)
}
