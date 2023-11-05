import { Slot } from "@radix-ui/react-slot"
import { LucideInfo } from "lucide-react"
import {
	type ComponentPropsWithRef,
	type ComponentPropsWithoutRef,
	type ForwardedRef,
	type ReactNode,
	createContext,
	useId,
	useMemo,
} from "react"
import { twMerge } from "tailwind-merge"
import { autoRef } from "../helpers/autoRef.ts"
import type { Spread } from "../helpers/types.ts"
import { panel } from "../styles/panel.ts"

function useFieldProvider() {
	const labelId = useId()
	const inputId = useId()
	const descriptionId = useId()
	return useMemo(
		() => ({ labelId, inputId, descriptionId }),
		[labelId, inputId, descriptionId],
	)
}

const FieldContext = createContext<ReturnType<typeof useFieldProvider>>({
	labelId: "",
	inputId: "",
	descriptionId: "",
})

export const Field = autoRef(function Field({
	asChild,
	...props
}: ComponentPropsWithRef<"div"> & { asChild?: boolean }) {
	const context = useFieldProvider()
	const Component = asChild ? Slot : "div"
	return (
		<FieldContext.Provider value={context}>
			<Component
				{...props}
				className={twMerge("flex min-w-0 flex-col gap-1", props.className)}
			/>
		</FieldContext.Provider>
	)
})

export const FieldLabel = autoRef(function FieldLabel({
	asChild,
	size,
	...props
}: Spread<
	ComponentPropsWithRef<"label">,
	{
		asChild?: boolean
		size?: "sm" | "base"
	}
>) {
	const context = useFieldProvider()
	const Component = asChild ? Slot : "label"
	return (
		<Component
			id={context.labelId}
			htmlFor={context.inputId}
			{...props}
			className={twMerge(
				size === "sm" ? "text-sm/none" : "text-base/none",
				"font-medium",
				props.className,
			)}
		/>
	)
})

export const FieldLabelText = autoRef(function FieldLabelText({
	asChild,
	...props
}: ComponentPropsWithRef<"p"> & { asChild?: boolean }) {
	const context = useFieldProvider()
	const Component = asChild ? Slot : "p"
	return (
		<Component
			id={context.labelId}
			{...props}
			className={twMerge("text-base/none font-medium", props.className)}
		/>
	)
})

export function FieldLabelTooltip({
	content,
	children,
}: {
	content: ReactNode
	children: ReactNode
}) {
	const tooltipId = useId()
	return (
		<div className="flex items-center gap-1">
			{children}
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
						"pointer-events-none absolute left-1/2 top-[calc(100%+4px)] z-10 w-48 -translate-x-1/2 rounded border px-2 py-1 text-sm leading-snug text-white opacity-0 shadow transition peer-hover:opacity-100 peer-focus:opacity-100",
					)}
				>
					{content}
				</div>
			</div>
		</div>
	)
}

export const FieldDescription = autoRef(function FieldDescription({
	children,
	asChild,
	ref,
}: {
	children: ReactNode
	asChild?: boolean
	ref: ForwardedRef<HTMLParagraphElement>
}) {
	const context = useFieldProvider()
	const Component = asChild ? Slot : "p"
	return (
		<Component
			id={context.descriptionId}
			className="text-sm opacity-75"
			ref={ref}
		>
			{children}
		</Component>
	)
})

export const FieldInput = autoRef(function FieldInput({
	asChild,
	...props
}: ComponentPropsWithoutRef<"input"> & {
	asChild?: boolean
	ref?: ForwardedRef<HTMLInputElement>
}) {
	const context = useFieldProvider()
	const Component = asChild ? Slot : "input"
	return (
		<Component
			id={context.inputId}
			aria-labelledby={context.labelId}
			aria-describedby={context.descriptionId}
			{...props}
		/>
	)
})
