import { LucideMinus, LucidePlus } from "lucide-react"
import { useState } from "react"
import { clamp } from "../helpers/math.ts"
import { panel } from "../styles/panel.ts"

export type CounterInputProps = {
	value?: number
	defaultValue?: number
	min?: number
	max?: number
	name?: string
	className?: string
	onChange?: (value: number) => void
}

export function CounterInput({
	defaultValue,
	min = -Infinity,
	max = Infinity,
	name,
	className,
	onChange,
	...props
}: CounterInputProps) {
	const [valueInternal, setValueInternal] = useState(defaultValue ?? 0)
	const value = props.value ?? valueInternal
	return (
		<div
			className={panel(
				"flex items-center justify-center gap-2 rounded-md border py-1",
				className,
			)}
		>
			<input type="hidden" name={name} value={value} />
			<button
				type="button"
				className="rounded-full p-1 transition hover:bg-base-800"
				onClick={() => {
					const newValue = clamp(value - 1, min, max)
					setValueInternal(newValue)
					onChange?.(newValue)
				}}
			>
				<LucideMinus className="s-5" />
			</button>
			<p className="min-w-8 text-center tabular-nums">
				{value}
				{max !== Infinity ? `/${max}` : ""}
			</p>
			<button
				type="button"
				className="rounded-full p-1 transition hover:bg-base-800"
				onClick={() => {
					const newValue = clamp(value + 1, min, max)
					setValueInternal(newValue)
					onChange?.(newValue)
				}}
			>
				<LucidePlus className="s-5" />
			</button>
		</div>
	)
}
