import { clamp } from "~/helpers/math.ts"
import type { StrictOmit } from "~/helpers/types.ts"
import { CounterInput, type CounterInputProps } from "../../ui/CounterInput.tsx"
import { input } from "../../ui/styles.ts"
import { CharacterContext } from "./CharacterContext.tsx"
import type { Attribute } from "./attributes.ts"
import { ATTRIBUTE_MAX, ATTRIBUTE_MIN } from "./constants.ts"
import { getCharacterAttributeValue } from "./data.ts"
import { useUpdateCharacterData } from "./useUpdateCharacterData.ts"

export function CharacterAttributeValueInput({
	attribute,
	editable,
}: {
	attribute: StrictOmit<CounterInputProps, "value" | "onChange"> & Attribute
	editable: boolean
}) {
	const character = CharacterContext.useValue()
	const value = getCharacterAttributeValue(character, attribute.id)
	const updateCharacterData = useUpdateCharacterData()

	const handleChange = (value: number) => {
		updateCharacterData(character._id, {
			[attribute.id]: clamp(value, ATTRIBUTE_MIN, ATTRIBUTE_MAX),
		})
	}

	return editable ?
			<CounterInput
				value={value}
				onChange={handleChange}
				min={ATTRIBUTE_MIN}
				max={ATTRIBUTE_MAX}
			/>
		:	<p className={input("text-center tabular-nums")}>
				{value}
				<span className="opacity-50">/{ATTRIBUTE_MAX}</span>
			</p>
}
