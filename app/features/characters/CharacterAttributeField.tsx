import { twMerge } from "tailwind-merge"
import type { StrictOmit } from "~/helpers/types.ts"
import type { CounterInputProps } from "../../ui/CounterInput.tsx"
import { Field, FieldLabelText, FieldLabelTooltip } from "../../ui/Field.tsx"
import { CharacterAttributeRollButton } from "./CharacterAttributeRollButton.tsx"
import { CharacterAttributeValueInput } from "./CharacterAttributeValueInput.tsx"
import { CharacterContext } from "./CharacterContext.tsx"
import type { Attribute } from "./attributes.ts"
import { getCharacterAttributeValue } from "./data.ts"

export function CharacterAttributeField({
	attribute,
	editable,
	...props
}: StrictOmit<CounterInputProps, "value" | "onChange"> & {
	attribute: Attribute
	editable: boolean
}) {
	const character = CharacterContext.useValue()
	const value = getCharacterAttributeValue(character, attribute.id)

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
					<CharacterAttributeValueInput
						{...props}
						attribute={attribute}
						editable={editable}
					/>
				</div>
				<CharacterAttributeRollButton attribute={attribute} />
			</div>
		</Field>
	)
}
