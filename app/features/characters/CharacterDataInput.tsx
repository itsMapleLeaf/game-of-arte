import type { Doc } from "convex/_generated/dataModel.js"
import type { ComponentPropsWithoutRef } from "react"
import ExpandingTextArea from "react-expanding-textarea"
import { clamp } from "~/helpers/math.ts"
import {
	CounterInput,
	type CounterInputProps,
} from "../../components/CounterInput.tsx"
import { ImageInput } from "../../components/ImageInput.tsx"
import type { FilterKeysByValue, Spread } from "../../helpers/types.ts"
import { useCurrentCharacter } from "./currentCharacter.tsx"
import { type CharacterData, parseCharacterData } from "./data.ts"
import { useCharacterDataValue } from "./useCharacterDataValue.ts"
import { useUpdateCharacterData } from "./useUpdateCharacterData.ts"

type CharacterDataInputProps<K extends keyof CharacterData> = {
	dataKey: K
}

function useCharacterDataInput<K extends keyof CharacterData>({
	dataKey,
}: CharacterDataInputProps<K>) {
	const character = useCurrentCharacter()
	const characterData = parseCharacterData(character.data)
	const updateCharacterData = useUpdateCharacterData()
	return {
		value: characterData[dataKey],
		onChange: (
			valueOrEvent:
				| { currentTarget: { value: CharacterData[K] } }
				| CharacterData[K],
		) => {
			updateCharacterData(character._id, {
				...characterData,
				[dataKey]:
					valueOrEvent && "currentTarget" in valueOrEvent ?
						valueOrEvent.currentTarget.value
					:	valueOrEvent,
			})
		},
	}
}

interface CharacterDataTextInputProps<
	K extends FilterKeysByValue<CharacterData, string>,
> extends ComponentPropsWithoutRef<"input">,
		CharacterDataInputProps<K> {}

export function CharacterDataTextInput<
	K extends FilterKeysByValue<CharacterData, string>,
>({ dataKey, ...props }: CharacterDataTextInputProps<K>) {
	// @ts-expect-error: we're deleting this file
	return <input {...props} {...useCharacterDataInput({ dataKey })} />
}

interface CharacterDataTextAreaProps
	extends ComponentPropsWithoutRef<"textarea"> {
	character: Doc<"characters">
	dataKey: keyof CharacterData
	fixedHeight?: boolean
}

export function CharacterDataTextArea({
	character,
	dataKey,
	fixedHeight,
	...props
}: CharacterDataTextAreaProps) {
	const [value, setValue] = useCharacterDataValue(character, dataKey)
	const Component = fixedHeight ? "textarea" : ExpandingTextArea
	return (
		<Component
			{...props}
			value={String(value ?? "")}
			onChange={(event) => {
				setValue(event.currentTarget.value)
			}}
		/>
	)
}

function toCharacterDataNumberValue(
	input: unknown,
	{ min = -Infinity, max = Infinity } = {},
) {
	const number = Number(input)
	if (!Number.isFinite(number)) return undefined
	return clamp(Math.round(number), min, max)
}

export function CharacterDataCounterInput({
	character,
	dataKey,
	defaultValue,
	...props
}: Spread<
	CounterInputProps,
	{
		character: Doc<"characters">
		dataKey: keyof CharacterData
		defaultValue?: number
	}
>) {
	const [value, setValue] = useCharacterDataValue(character, dataKey)
	return (
		<CounterInput
			{...props}
			value={toCharacterDataNumberValue(value) ?? defaultValue}
			onChange={setValue}
		/>
	)
}

export function CharacterDataImageInput({
	character,
	dataKey,
	...props
}: Spread<
	ComponentPropsWithoutRef<"input">,
	{ character: Doc<"characters">; dataKey: keyof CharacterData }
>) {
	const [value, setValue] = useCharacterDataValue(character, dataKey)
	return (
		<ImageInput
			{...props}
			value={String(value ?? "")}
			onChange={(event) => {
				setValue(event.currentTarget.value)
			}}
		/>
	)
}

export function CharacterDataSelectInput({
	character,
	dataKey,
	...props
}: Spread<
	ComponentPropsWithoutRef<"select">,
	{ character: Doc<"characters">; dataKey: keyof CharacterData }
>) {
	const [value, setValue] = useCharacterDataValue(character, dataKey)
	return (
		<select
			{...props}
			value={String(value ?? "")}
			onChange={(event) => {
				setValue(event.currentTarget.value)
			}}
		/>
	)
}
