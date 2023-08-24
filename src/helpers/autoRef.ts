import { forwardRef, type ForwardedRef, type ReactNode } from "react"

export function autoRef<Props, RefValue>(
	component: (props: Props & { ref: ForwardedRef<RefValue> }) => ReactNode,
) {
	function AutoRef(props: Props, ref: ForwardedRef<RefValue>) {
		return component({ ...props, ref })
	}

	AutoRef.displayName = `AutoRef(${component.name})`

	return forwardRef(AutoRef)
}
