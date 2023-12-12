import { LucideMinus, LucidePlus } from "lucide-react"
import { autoRef } from "~/helpers/autoRef.tsx"
import type { StrictOmit } from "~/helpers/types.ts"
import { clamp } from "../helpers/math.ts"
import { panel } from "../styles/panel.ts"
import { SrOnly } from "./SrOnly.tsx"

export interface CounterInputProps
	extends StrictOmit<React.ComponentPropsWithRef<"div">, "onChange"> {
	value?: number
	defaultValue?: number
	min?: number
	max?: number
	name?: string
	className?: string
	onChange?: (value: number) => void
}

export const CounterInput = autoRef(function CounterInput({
	min = 0,
	max = Infinity,
	defaultValue = clamp(0, min, max),
	value: valueProp = defaultValue,
	className,
	onChange,
	...props
}: CounterInputProps) {
	const value = clamp(valueProp, min, max)

	const setValue = (newValue: number) => {
		onChange?.(clamp(newValue, min, max))
	}

	return (
		<div
			// biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard interaction is handled
			tabIndex={0}
			aria-valuenow={value}
			aria-valuemin={min}
			aria-valuemax={max}
			{...props}
			className={panel(
				"flex h-10 items-center justify-center gap-2 rounded-md border py-1",
				className,
			)}
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
				props.onKeyDown?.(event)
			}}
		>
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
