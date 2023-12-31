import { Slot, Slottable } from "@radix-ui/react-slot"
import { LucideInfo } from "lucide-react"
import {
	type ComponentPropsWithRef,
	type ComponentPropsWithoutRef,
	type ForwardedRef,
	type FunctionComponent,
	type ReactElement,
	type ReactNode,
	createContext,
	isValidElement,
	useContext,
	useId,
	useMemo,
} from "react"
import { twMerge } from "tailwind-merge"
import { pick } from "~/helpers/object.ts"
import { autoRef } from "../helpers/autoRef.tsx"
import type { Nullish, Spread } from "../helpers/types.ts"
import { panel } from "./styles.ts"

const FieldContext = createContext({
	labelId: "",
	inputId: "",
	descriptionId: "",
})

export function useFieldContext() {
	return useContext(FieldContext)
}

export interface FieldPropsBase {
	label?: string | React.ReactElement
	labelText?: string | React.ReactElement
	labelTooltip?: string | React.ReactElement
	description?: string | React.ReactElement
	errors?: string | string[]
}

export interface FieldProps
	extends FieldPropsBase,
		ComponentPropsWithRef<"div"> {
	asChild?: boolean
}

export const Field = autoRef(function Field({
	children,
	asChild,
	label,
	labelText,
	labelTooltip,
	description,
	errors,
	...props
}: FieldProps) {
	const labelId = useId()
	const inputId = useId()
	const descriptionId = useId()

	const context = useMemo(
		() => ({ labelId, inputId, descriptionId }),
		[labelId, inputId, descriptionId],
	)

	let labelElement =
		label ? <FieldLabel asChild={isValidElement(label)}>{label}</FieldLabel>
		: labelText ?
			<FieldLabelText asChild={isValidElement(labelText)}>
				{labelText}
			</FieldLabelText>
		:	null

	if (labelTooltip) {
		labelElement = (
			<FieldLabelTooltip content={labelTooltip}>
				{labelElement}
			</FieldLabelTooltip>
		)
	}

	const Component = asChild ? Slot : "div"
	return (
		<FieldContext.Provider value={context}>
			<Component
				{...props}
				className={twMerge("flex min-w-0 flex-col gap-1", props.className)}
			>
				{labelElement}
				{description && (
					<FieldDescription asChild={isValidElement(description)}>
						{description}
					</FieldDescription>
				)}
				<Slottable>{children}</Slottable>
				<FieldErrors errors={errors} />
			</Component>
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
	const context = useFieldContext()
	const Component = asChild ? Slot : "label"
	return (
		<Component
			id={context.labelId}
			htmlFor={context.inputId}
			{...props}
			className={twMerge(
				"select-none font-medium",
				size === "sm" ? "text-sm/none" : "text-base/none",
				props.className,
			)}
		/>
	)
})

export const FieldLabelText = autoRef(function FieldLabelText({
	asChild,
	...props
}: ComponentPropsWithRef<"p"> & { asChild?: boolean }) {
	const context = useFieldContext()
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
	content: string | ReactElement | undefined
	children: ReactNode
}) {
	const tooltipId = useId()
	return content == null ? children : (
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
	const context = useFieldContext()
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

export type FieldErrorList = Nullish<string | string[]>

export const FieldErrors = autoRef(function FieldErrors({
	errors,
	asChild,
	...props
}: ComponentPropsWithRef<"div"> & {
	errors: FieldErrorList
	asChild?: boolean
}) {
	const messages = [errors].flat().filter(Boolean)
	const Component = asChild ? Slot : "div"
	return messages.length === 0 ?
			null
		:	<Component
				role="alert"
				{...props}
				className={twMerge("text-sm text-error-400", props.className)}
			>
				{messages.map((message) => (
					<p key={message}>{message}</p>
				))}
			</Component>
})

export const FieldInput = autoRef(function FieldInput({
	asChild,
	errors,
	...props
}: ComponentPropsWithoutRef<"input"> & {
	asChild?: boolean
	errors?: FieldErrorList
	ref?: ForwardedRef<HTMLInputElement>
}) {
	const context = useFieldContext()
	const Component = asChild ? Slot : "input"
	return (
		<>
			<FieldErrors errors={errors} />
			<Component
				id={context.inputId}
				aria-labelledby={context.labelId}
				aria-describedby={context.descriptionId}
				{...props}
			/>
		</>
	)
})

export function createFieldComponent<Props>(
	Component: FunctionComponent<Props>,
) {
	return autoRef(function FieldComponent(props: Props & FieldPropsBase) {
		return (
			<Field
				{...pick(props, [
					"label",
					"labelText",
					"labelTooltip",
					"description",
					"errors",
				])}
			>
				<FieldInput asChild>
					<Component {...props} />
				</FieldInput>
			</Field>
		)
	})
}
