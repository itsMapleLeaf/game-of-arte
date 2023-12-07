import * as Ariakit from "@ariakit/react"
import { LucideChevronDown } from "lucide-react"
import type { ReactElement } from "react"
import {
	Field,
	FieldDescription,
	FieldErrors,
	FieldLabel,
	FieldLabelTooltip,
} from "~/components/Field.tsx"
import { autoRef } from "~/helpers/autoRef.tsx"
import type { StrictOmit } from "~/helpers/types.ts"
import { panel } from "~/styles/panel.ts"
import { buttonStyle } from "./Button.tsx"

export function Select<Value extends string | string[]>({
	name,
	children,
	...props
}: Ariakit.SelectProviderProps<Value> & { name?: string }) {
	const store = Ariakit.useSelectStore({
		animated: true,
		...props,
	})
	return (
		<Ariakit.SelectProvider store={store}>
			{children}
			{name && (
				<input type="hidden" name={name} value={store.getState().value} />
			)}
		</Ariakit.SelectProvider>
	)
}

export const SelectLabel = autoRef(function SelectLabel(
	props: Ariakit.SelectLabelProps,
) {
	return <Ariakit.SelectLabel {...props} />
})

export const SelectButton = autoRef(function SelectButton({
	children,
	...props
}: StrictOmit<Ariakit.SelectProps, "children"> & {
	children?: React.ReactNode
}) {
	return (
		<Ariakit.Select
			{...props}
			render={
				<button
					type="button"
					className={panel(
						"inline-flex h-10 items-center justify-between gap-2 rounded border px-3 transition",
						props.className,
					)}
				>
					{children}
					<LucideChevronDown className="-mx-1" />
				</button>
			}
		/>
	)
})

export const SelectPopover = autoRef(function SelectPopover(
	props: Ariakit.SelectPopoverProps,
) {
	return (
		<Ariakit.SelectPopover
			gutter={8}
			{...props}
			render={
				<div
					className={panel(
						"flex min-w-[--popover-anchor-width] flex-col rounded border shadow-md transition ring-no-inset data-[enter]:translate-y-0 data-[leave]:translate-y-2 data-[enter]:opacity-100 data-[leave]:opacity-0",
						props.className,
					)}
				/>
			}
		/>
	)
})

export const SelectItem = autoRef(function SelectItem(
	props: Ariakit.SelectItemProps,
) {
	return (
		<Ariakit.SelectItem
			{...props}
			render={
				<div
					className={buttonStyle({
						appearance: "clear",
						className: [
							"cursor-pointer justify-start rounded-none border-none first:rounded-t last:rounded-b data-[active-item]:bg-base-800 data-[active-item]:text-accent-400",
							props.className,
						],
					})}
				/>
			}
		/>
	)
})

export function SelectField({
	label,
	labelTooltip,
	description,
	name,
	value,
	setValue,
	defaultValue,
	errors,
	buttonContent = value || defaultValue,
	children,
}: {
	label: string | ReactElement
	labelTooltip?: string | ReactElement
	description?: string | ReactElement
	name?: string
	value?: string
	setValue?: (value: string) => void
	defaultValue?: string
	errors?: string[]
	buttonContent?: React.ReactNode
	children?: React.ReactNode
}) {
	return (
		<Field>
			<Select
				name={name}
				defaultValue={defaultValue}
				value={value}
				setValue={setValue}
			>
				<FieldLabelTooltip content={labelTooltip}>
					<FieldLabel asChild>
						<SelectLabel>{label}</SelectLabel>
					</FieldLabel>
				</FieldLabelTooltip>
				{description && <FieldDescription>{description}</FieldDescription>}
				<SelectButton>{buttonContent}</SelectButton>
				<SelectPopover>{children}</SelectPopover>
				<FieldErrors errors={errors} />
			</Select>
		</Field>
	)
}
