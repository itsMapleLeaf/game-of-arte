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
import { CharacterContext } from "./CharacterContext.tsx"
import type { Attribute } from "./attributes.ts"
import { ATTRIBUTE_DEFAULT, ATTRIBUTE_MAX, ATTRIBUTE_MIN } from "./constants.ts"
import { useCharacterDataValue } from "./useCharacterDataValue.ts"

export function AttributeInput({
	attribute,
	editable,
	...props
}: CounterInputProps & {
	attribute: Attribute
	editable: boolean
}) {
	const character = CharacterContext.useValue()

	const [valueRaw, setValue] = useCharacterDataValue(
		character,
		attribute.dataKey,
	)

	const value = clamp(
		toFiniteNumberOrUndefined(valueRaw) ?? ATTRIBUTE_DEFAULT,
		ATTRIBUTE_MIN,
		ATTRIBUTE_MAX,
	)

	const [popoverOpen, setPopoverOpen] = useState(false)

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
