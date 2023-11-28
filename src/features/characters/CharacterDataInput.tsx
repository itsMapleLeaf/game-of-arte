import type { Doc } from "convex/_generated/dataModel.js"
import type { ComponentPropsWithoutRef } from "react"
import ExpandingTextArea from "react-expanding-textarea"
import {
	CounterInput,
	type CounterInputProps,
} from "../../components/CounterInput.tsx"
import { ImageInput } from "../../components/ImageInput.tsx"
import { toFiniteNumberOrUndefined } from "../../helpers/index.ts"
import type { Spread } from "../../helpers/types.ts"
import type { CharacterData } from "./data.ts"
import { useCharacterDataValue } from "./useCharacterDataValue.ts"

export function CharacterDataInput({
	character,
	dataKey,
	...props
}: Omit<
	Spread<
		ComponentPropsWithoutRef<"input">,
		{ character: Doc<"characters">; dataKey: keyof CharacterData }
	>,
	"children"
>) {
	const [value, setValue] = useCharacterDataValue(character, dataKey)
	return (
		<input
			{...props}
			value={String(value ?? "")}
			onChange={(event) => {
				setValue(event.currentTarget.value)
			}}
		/>
	)
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
			value={toFiniteNumberOrUndefined(value) ?? defaultValue}
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
