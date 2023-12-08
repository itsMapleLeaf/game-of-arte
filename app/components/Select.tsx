import * as Ariakit from "@ariakit/react"
import { LucideChevronDown } from "lucide-react"
import type { ReactElement } from "react"
import { buttonStyle } from "./Button.tsx"

export function Select<Value extends string>({
	name,
	label,
	value,
	options,
	onChange,
}: {
	name?: string
	label?: string | ReactElement
	value?: Value
	options: Array<{
		value: Value
		label: string
		icon?: React.ElementType<{ className: string; "aria-hidden": true }>
	}>
	onChange?: (value: Value) => void
}) {
	const store = Ariakit.useSelectStore({
		animated: true,
		value,
		setValue: onChange,
	})
	return (
		<Ariakit.SelectProvider store={store}>
			{label && <Ariakit.SelectLabel>{label}</Ariakit.SelectLabel>}
			{name && (
				<input type="hidden" name={name} value={store.getState().value} />
			)}
			<Ariakit.Select className="inline-flex h-10 items-center justify-between gap-2 rounded border px-3 transition">
				{(value && options.find((option) => option.value === value)?.label) || (
					<span className="italic opacity-75">Choose one...</span>
				)}
				<LucideChevronDown className="-mx-1" />
			</Ariakit.Select>
			<Ariakit.SelectPopover
				gutter={8}
				render={
					<div className="flex min-w-[--popover-anchor-width] flex-col rounded border shadow-md transition ring-no-inset data-[enter]:translate-y-0 data-[leave]:translate-y-2 data-[enter]:opacity-100 data-[leave]:opacity-0" />
				}
			>
				{options.map((option) => (
					<Ariakit.SelectItem
						key={option.value}
						value={option.value}
						render={
							<div
								className={buttonStyle({
									appearance: "clear",
									className:
										"cursor-pointer justify-start rounded-none border-none first:rounded-t last:rounded-b data-[active-item]:bg-base-800 data-[active-item]:text-accent-400",
								})}
							>
								{option.icon && (
									<option.icon className="mr-2 flex-shrink-0 s-5" aria-hidden />
								)}
								{option.label}
							</div>
						}
					/>
				))}
			</Ariakit.SelectPopover>
		</Ariakit.SelectProvider>
	)
}
