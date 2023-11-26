import { Slot } from "@radix-ui/react-slot"
import { autoRef } from "~/helpers/autoRef.tsx"

export interface SrOnlyProps extends React.ComponentPropsWithoutRef<"span"> {
	asChild?: boolean
}

export const SrOnly = autoRef(function SrOnly({
	asChild,
	...props
}: SrOnlyProps) {
	const Component = asChild ? Slot : "span"
	return <Component {...props} className="sr-only" />
})
