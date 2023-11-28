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
import { input } from "../../styles/index.ts"
import { CharacterAttributeRollForm } from "./CharacterAttributeRollForm.tsx"
import { CharacterContext } from "./CharacterContext.tsx"
import type { Attribute } from "./attributes.ts"
import { ATTRIBUTE_MAX, ATTRIBUTE_MIN } from "./constants.ts"
import { getCharacterAttributeValue } from "./data.ts"
import { useUpdateCharacterData } from "./useUpdateCharacterData.ts"

export function AttributeInput({
	attribute,
	editable,
	...props
}: CounterInputProps & {
	attribute: Attribute & { id: string }
	editable: boolean
}) {
	const [popoverOpen, setPopoverOpen] = useState(false)

	const character = CharacterContext.useValue()
	const value = getCharacterAttributeValue(character, attribute.id)
	const updateCharacterData = useUpdateCharacterData()

	const handleChange = (value: number) => {
		updateCharacterData(character._id, {
			[attribute.id]: clamp(value, ATTRIBUTE_MIN, ATTRIBUTE_MAX),
		})
	}

	return (
		<Field>
			<div
				className={twMerge(
					"transition-colors",
					value > 1 ? "text-accent-400" : "",
				)}
			>
				<FieldLabelTooltip content={attribute.description}>
					<FieldLabelText>{attribute.name}</FieldLabelText>
				</FieldLabelTooltip>
			</div>
			<div className="flex items-center gap-2">
				<div className="flex-1">
					{editable ?
						<CounterInput
							{...props}
							value={value}
							onChange={handleChange}
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
					<PopoverPanel
						className="w-64 p-4"
						// adding dice can sometimes cause layout shift,
						// so we'll make it align end and disable collision avoidance
						// to prevent that
						side="bottom"
						align="end"
						avoidCollisions={false}
					>
						<CharacterAttributeRollForm
							attribute={attribute}
							onSuccess={() => setPopoverOpen(false)}
						/>
					</PopoverPanel>
				</Popover>
			</div>
		</Field>
	)
}
