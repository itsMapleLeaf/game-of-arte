import { useId } from "react"
import { renderSlot, type Slot } from "../helpers/slot.ts"
import { field } from "../styles"

export function Field({
	label,
	description,
	children = <input />,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
	label: string
	description?: string
	children?: Slot<React.InputHTMLAttributes<HTMLInputElement>>
}) {
	const inputId = useId()
	const descriptionId = useId()
	return (
		<div className={field()}>
			<label htmlFor={inputId} className="font-medium leading-none">
				{label}
			</label>
			{description && (
				<p id={descriptionId} className="text-sm opacity-75">
					{description}
				</p>
			)}
			{renderSlot(children, {
				...props,
				id: inputId,
				"aria-describedby": descriptionId,
			})}
		</div>
	)
}
