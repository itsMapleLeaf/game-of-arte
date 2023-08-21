import { LucideInfo } from "lucide-react"
import { useId } from "react"
import { renderSlot, type Slot } from "../helpers/slot.ts"
import { field, fieldDescription, labelText } from "../styles/index.ts"
import { panel } from "../styles/panel.ts"

export function Field({
	label,
	description,
	tooltip,
	children = <input />,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
	label: string
	description?: string
	tooltip?: string
	children?: Slot<React.InputHTMLAttributes<HTMLInputElement>>
}) {
	const inputId = useId()
	const descriptionId = useId()
	const tooltipId = useId()
	return (
		<div className={field()}>
			<div className="flex items-center gap-1">
				<label htmlFor={inputId} className={labelText()}>
					{label}
				</label>
				{tooltip && (
					<div className="relative h-fit">
						<button
							type="button"
							className="peer block rounded-full"
							aria-describedby={tooltipId}
						>
							<LucideInfo className="s-4" />
							<span className="sr-only">More details</span>
						</button>
						<div
							id={tooltipId}
							className={panel(
								"pointer-events-none absolute left-1/2 top-[calc(100%+4px)] z-10 w-48 -translate-x-1/2 rounded border px-2 py-1 text-sm leading-snug opacity-0 shadow transition peer-hover:opacity-100 peer-focus:opacity-100",
							)}
						>
							{tooltip}
						</div>
					</div>
				)}
			</div>
			{description && (
				<p id={descriptionId} className={fieldDescription()}>
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
