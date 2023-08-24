import { LucideInfo } from "lucide-react"
import { useId } from "react"
import { twMerge, type ClassNameValue } from "tailwind-merge"
import { renderSlot, type Slot } from "../helpers/slot.ts"
import { type Spread } from "../helpers/types.ts"
import { panel } from "../styles/panel.ts"

export type FieldLabelVariant = "sm" | "base"

export function Field({
	label,
	labelVariant,
	description,
	tooltip,
	children = <input />,
	containerClassName,
	...props
}: Spread<
	React.InputHTMLAttributes<HTMLInputElement>,
	{
		label: string
		labelVariant?: FieldLabelVariant
		description?: string
		tooltip?: string
		children?: Slot<React.InputHTMLAttributes<HTMLInputElement>>
		containerClassName?: string
	}
>) {
	const inputId = useId()
	const descriptionId = useId()
	const tooltipId = useId()
	return (
		<div className={field(containerClassName)}>
			<div className="flex items-center gap-1">
				<label htmlFor={inputId} className={fieldLabel(labelVariant)}>
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

export function field(...classes: ClassNameValue[]) {
	return twMerge("flex flex-col gap-1 min-w-0", ...classes)
}

export function fieldLabel(
	variant: FieldLabelVariant = "base",
	...classes: ClassNameValue[]
) {
	return twMerge(
		"font-medium",
		variant === "sm" ? "text-sm/none" : "text-base/none",
		...classes,
	)
}

export function fieldDescription(...classes: ClassNameValue[]) {
	return twMerge("text-sm opacity-75", ...classes)
}
