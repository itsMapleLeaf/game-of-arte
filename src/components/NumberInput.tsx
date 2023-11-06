import type { Spread } from "../helpers/types.ts"
import { input } from "../styles/index.ts"

export function NumberInput({
	defaultValue,
	...props
}: Spread<
	React.InputHTMLAttributes<HTMLInputElement>,
	{ defaultValue?: number }
>) {
	return (
		<input
			step={1}
			{...props}
			type="number"
			value={props.value ?? defaultValue ?? 0}
			className={input("text-center")}
		/>
	)
}
