import { Slot } from "@radix-ui/react-slot"
import { autoRef } from "~/helpers/autoRef.tsx"
import { twStyle } from "~/styles/twStyle.ts"

export interface FormProps extends React.ComponentPropsWithRef<"form"> {
	asChild?: boolean
}

export const Form = autoRef(function Form({ asChild, ...props }: FormProps) {
	const Component = asChild ? Slot : "form"
	return <Component {...props} className={formStyle(props.className)} />
})

export const formStyle = twStyle("grid gap-4")
