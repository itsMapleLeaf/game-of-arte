import { type ForwardedRef, type ReactNode, forwardRef } from "react"

/**
 * Makes ref a passthrough prop, a nicer alternative to forwardRef.
 *
 * @example
 * 	import { twMerge } from "~/styles/twMerge.ts"
 *
 * 	interface ContainerProps extends React.ComponentPropsWithRef<"div"> {}
 *
 * 	const Container = autoRef(function Container(props) {
 * 		return (
 * 			<section
 * 				{...props}
 * 				className={twMerge("container", props.className)}
 * 			/>
 * 		)
 * 	})
 */
export function autoRef<Props, RefValue>(
	component: (props: Props & { ref: ForwardedRef<RefValue> }) => ReactNode,
) {
	/* @forgetti skip */
	function AutoRef(props: Props, ref: ForwardedRef<RefValue>) {
		return component({ ...props, ref })
	}

	AutoRef.displayName = `AutoRef(${component.name})`

	return forwardRef(AutoRef)
}
