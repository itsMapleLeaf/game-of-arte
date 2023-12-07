import { LucideMinus, LucidePlus } from "lucide-react"
import { useState } from "react"
import { autoRef } from "~/helpers/autoRef.tsx"
import type { PartialKeys, StrictOmit } from "~/helpers/types.ts"
import { clamp } from "../helpers/math.ts"
import { panel } from "../styles/panel.ts"
import { createFieldComponent } from "./Field.tsx"
import { SrOnly } from "./SrOnly.tsx"

export interface CounterInputProps
	extends StrictOmit<React.ComponentPropsWithRef<"input">, "onChange"> {
	value: number
	min?: number
	max?: number
	defaultValue?: number
	name?: string
	className?: string
	onChange: (value: number) => void
}

export const CounterInput = autoRef(function CounterInput({
	value: valueProp,
	min = 0,
	max = Infinity,
	defaultValue = clamp(valueProp, min, max),
	className,
	onChange,
	...props
}: CounterInputProps) {
	const value = clamp(valueProp, min, max)

	const setValue = (newValue: number) => {
		onChange(clamp(newValue, min, max))
	}

	return (
		<div
			aria-labelledby={props["aria-labelledby"]}
			aria-describedby={props["aria-describedby"]}
			aria-valuenow={value}
			aria-valuemin={min}
			aria-valuemax={max}
			className={panel(
				"flex h-10 items-center justify-center gap-2 rounded-md border py-1",
				className,
			)}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard interaction is handled
			tabIndex={0}
			onKeyDown={(event) => {
				if (event.key === "ArrowUp" || event.key === "ArrowRight") {
					event.preventDefault()
					setValue(value + 1)
				}
				if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
					event.preventDefault()
					setValue(value - 1)
				}
				if (event.key === "KeyR") {
					event.preventDefault()
					setValue(defaultValue)
				}
			}}
		>
			{props.name && (
				<input type="hidden" aria-hidden name={props.name} value={value} />
			)}
			<button
				type="button"
				className="rounded-full p-1 transition hover:bg-base-800"
				tabIndex={-1}
				onClick={() => {
					setValue(value - 1)
				}}
			>
				<LucideMinus className="s-5" />
				<SrOnly>Decrease</SrOnly>
			</button>
			<p className="min-w-7 text-center tabular-nums">
				{value}
				{max !== Infinity ? `/${max}` : ""}
			</p>
			<button
				type="button"
				className="rounded-full p-1 transition hover:bg-base-800"
				tabIndex={-1}
				onClick={() => {
					setValue(value + 1)
				}}
			>
				<LucidePlus className="s-5" />
				<SrOnly>Increase</SrOnly>
			</button>
		</div>
	)
})

export const CounterInputField = createFieldComponent(CounterInput)

export const CounterInputUncontrolled = autoRef(
	function CounterInputUncontrolled({
		min = 0,
		max = Infinity,
		defaultValue = min,
		onChange,
		...props
	}: PartialKeys<Omit<CounterInputProps, "value">, "onChange">) {
		const [value, setValue] = useState(defaultValue)
		return (
			<CounterInput
				{...props}
				value={value}
				min={min}
				max={max}
				defaultValue={defaultValue}
				onChange={(newValue) => {
					setValue(newValue)
					onChange?.(newValue)
				}}
			/>
		)
	},
)

export const CounterInputUncontrolledField = createFieldComponent(
	CounterInputUncontrolled,
)
