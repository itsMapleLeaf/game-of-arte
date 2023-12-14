import ExpandingTextArea from "react-expanding-textarea"
import { autoRef } from "~/helpers/autoRef.tsx"
import { twStyle } from "~/ui/twStyle.ts"
import { createFieldComponent } from "./Field.tsx"
import { panel } from "./styles.ts"

export interface TextAreaProps extends React.ComponentPropsWithRef<"textarea"> {
	value?: string
	expands?: boolean
}

export const TextArea = autoRef(function TextArea({
	expands,
	...props
}: TextAreaProps) {
	const Component = expands ? ExpandingTextArea : "textarea"
	return <Component {...props} className={textAreaStyle(props.className)} />
})

export const textAreaStyle = twStyle(
	panel(
		"block w-full min-w-0 resize-none rounded-md border px-3 py-2 leading-6 transition",
	),
)

export const TextAreaField = createFieldComponent(TextArea)
