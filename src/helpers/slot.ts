import { cloneElement, isValidElement, type ReactNode } from "react"

export type Slot<Props extends object> =
	| React.ReactElement<Props>
	| ((props: Props) => ReactNode)

export function renderSlot<Props extends object>(
	slot: Slot<Props>,
	props: Props,
): ReactNode {
	return isValidElement(slot) ? cloneElement(slot, props) : slot(props)
}
