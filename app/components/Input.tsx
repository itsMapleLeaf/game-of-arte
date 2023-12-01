import { autoRef } from "~/helpers/autoRef.tsx"
import { panel } from "~/styles/panel.ts"
import { twStyle } from "~/styles/twStyle.ts"

// biome-ignore lint/suspicious/noEmptyInterface: there will probably be more props later
export interface InputProps extends React.ComponentPropsWithRef<"input"> {}

export const Input = autoRef(function Input(props: InputProps) {
	return <input {...props} className={inputStyle(props.className)} />
})

export const inputStyle = twStyle(
	panel("h-10 w-full min-w-0 rounded-md border p-3 leading-none transition"),
)
