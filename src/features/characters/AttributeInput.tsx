import type { Doc } from "convex/_generated/dataModel.js"
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
	FieldLabelText,
	FieldLabelTooltip,
} from "../../components/Field.tsx"
import {
	Popover,
	PopoverPanel,
	PopoverTrigger,
} from "../../components/Popover.tsx"
import { toFiniteNumberOrUndefined } from "../../helpers/index.ts"
import { input } from "../../styles/index.ts"
import { CharacterAttributeRollForm } from "./CharacterAttributeRollForm.tsx"
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
					{editable ?
						<CounterInput
							{...props}
							value={value}
							onChange={setValue}
							min={1}
							max={5}
						/>
					:	<p className={input("text-center tabular-nums")}>
							{value}
							<span className="opacity-50">/5</span>
						</p>
					}
				</div>
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<PopoverTrigger
						type="button"
						className="rounded-md p-2 transition hover:bg-base-800"
					>
						<LucideDices />
					</PopoverTrigger>
					<PopoverPanel side="bottom" align="center" className="w-64 p-4">
						<CharacterAttributeRollForm
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
