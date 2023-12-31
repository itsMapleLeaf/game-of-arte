import { autoRef } from "~/helpers/autoRef.tsx"
import { twStyle } from "~/ui/twStyle.ts"
import { createFieldComponent } from "./Field.tsx"
import { panel } from "./styles.ts"

export interface InputProps extends React.ComponentPropsWithRef<"input"> {}

export const Input = autoRef(function Input(props: InputProps) {
	return <input {...props} className={inputStyle(props.className)} />
})

export const inputStyle = twStyle(
	panel("h-10 w-full min-w-0 rounded-md border p-3 leading-none transition"),
)

export const InputField = createFieldComponent(Input)
