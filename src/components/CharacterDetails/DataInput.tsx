import type { Doc } from "convex/_generated/dataModel.js"
import type { ComponentPropsWithoutRef } from "react"
import ExpandingTextArea, { type TextareaProps } from "react-expanding-textarea"
import { toFiniteNumberOrUndefined } from "../../helpers/index.ts"
import type { Spread } from "../../helpers/types.ts"
import { CounterInput, type CounterInputProps } from "../CounterInput.tsx"
import { ImageInput } from "./ImageInput.tsx"
import { useCharacterDataValue } from "./useCharacterDataValue.ts"

export function DataInput({
	character,
	dataKey,
	...props
}: Omit<
	Spread<
		ComponentPropsWithoutRef<"input">,
		{ character: Doc<"characters">; dataKey: string }
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

export function DataTextArea({
	character,
	dataKey,
	...props
}: Spread<TextareaProps, { character: Doc<"characters">; dataKey: string }>) {
	const [value, setValue] = useCharacterDataValue(character, dataKey)
	return (
		<ExpandingTextArea
			{...props}
			value={String(value ?? "")}
			onChange={(event) => {
				setValue(event.currentTarget.value)
			}}
		/>
	)
}

export function DataCounterInput({
	character,
	dataKey,
	...props
}: Spread<
	CounterInputProps,
	{ character: Doc<"characters">; dataKey: string; defaultValue?: number }
>) {
	const [value, setValue] = useCharacterDataValue(character, dataKey)
	return (
		<CounterInput
			{...props}
			value={toFiniteNumberOrUndefined(value)}
			onChange={setValue}
		/>
	)
}

export function DataImageInput({
	character,
	dataKey,
	...props
}: Spread<
	ComponentPropsWithoutRef<"input">,
	{ character: Doc<"characters">; dataKey: string }
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

export function DataSelectInput({
	character,
	dataKey,
	...props
}: Spread<
	ComponentPropsWithoutRef<"select">,
	{ character: Doc<"characters">; dataKey: string }
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
