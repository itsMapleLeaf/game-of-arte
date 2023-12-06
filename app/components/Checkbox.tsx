import { autoRef } from "~/helpers/autoRef.tsx"
import { panel } from "~/styles/panel.ts"
import { twStyle } from "~/styles/twStyle.ts"

export interface CheckboxProps extends React.ComponentPropsWithRef<"input"> {}

export const Checkbox = autoRef(function Checkbox(props: CheckboxProps) {
	return (
		<input
			{...props}
			type="checkbox"
			className={checkboxStyle(props.className)}
		/>
	)
})

/** @public */
export const checkboxStyle = twStyle(panel("accent-accent-400 s-4"))
