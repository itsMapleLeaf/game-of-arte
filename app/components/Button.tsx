import { Slot, Slottable } from "@radix-ui/react-slot"
import { LucideLoader2 } from "lucide-react"
import type { ClassNameValue } from "tailwind-merge"
import { autoRef } from "~/helpers/autoRef.tsx"
import type { PartialKeys, StrictOmit } from "~/helpers/types.ts"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { type TwStyle, twStyle } from "~/styles/twStyle.ts"

export interface ButtonProps
	extends StrictOmit<React.ComponentPropsWithRef<"button">, "onClick">,
		StrictOmit<ButtonStyleProps, "className"> {
	asChild?: boolean
	icon?: ButtonIconComponent
	iconPosition?: "start" | "end"
	pending?: boolean
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => unknown
}

export type ButtonIconComponent = (props: {
	className: string
	"aria-hidden": true
}) => React.ReactNode

export const Button = autoRef(function Button({
	asChild,
	size = "default",
	icon: IconComponent,
	iconPosition = "start",
	pending,
	children,
	appearance = "solid",
	square = false,
	className,
	onClick,
	...buttonProps
}: ButtonProps) {
	const [handleClick, state] = useAsyncCallback(
		async (event: React.MouseEvent<HTMLButtonElement>) => {
			await onClick?.(event)
		},
	)

	let icon
	if (pending ?? state.isLoading) {
		icon = (
			<LucideLoader2
				aria-hidden
				className={buttonIconStyle({ size, className: "animate-spin" })}
			/>
		)
	} else if (IconComponent) {
		icon = <IconComponent aria-hidden className={buttonIconStyle({ size })} />
	}

	const Component = asChild ? Slot : "button"
	return (
		<Component
			type="button"
			{...buttonProps}
			className={buttonStyle({
				appearance,
				size,
				square,
				className,
			})}
			onClick={handleClick}
		>
			{iconPosition === "start" && icon}
			<Slottable>{children}</Slottable>
			{iconPosition === "end" && icon}
		</Component>
	)
})

export interface ButtonStyleProps {
	appearance?: keyof typeof buttonAppearanceStyles
	size?: keyof typeof buttonSizeStyles
	className?: ClassNameValue
	square?: boolean
}

export function buttonStyle({
	appearance,
	size,
	square,
	className,
}: PartialKeys<Required<ButtonStyleProps>, "className">) {
	return twMerge(
		buttonAppearanceStyles[appearance](),
		buttonSizeStyles[size](),
		square && "aspect-square",
		className,
	)
}

const baseAppearanceStyle = twStyle(
	"inline-flex items-center justify-center rounded-md border border-transparent leading-tight text-white ring-accent-300 transition focus:outline-none focus-visible:ring-2 disabled:opacity-50",
)

const buttonAppearanceStyles = {
	solid: twStyle(
		baseAppearanceStyle(
			"border-accent-700 bg-accent-700 bg-opacity-25 hover:bg-opacity-50",
		),
	),
	negative: twStyle(
		baseAppearanceStyle(
			"border-error-700 bg-error-700 bg-opacity-25 hover:bg-opacity-50",
		),
	),
	outline: twStyle(baseAppearanceStyle("border-base-700 hover:bg-base-800")),
	clear: twStyle(baseAppearanceStyle("hover:bg-base-800")),
	faded: twStyle(
		baseAppearanceStyle("opacity-50 hover:opacity-100 focus:opacity-100"),
	),
}

const buttonSizeStyles = {
	default: twStyle("min-h-10 gap-3 px-3 py-2 text-base"),
	small: twStyle("min-h-8 gap-2 px-2 py-1 text-sm"),
}

const buttonIconSizeStyles: Record<keyof typeof buttonSizeStyles, TwStyle> = {
	default: twStyle("-mx-1 flex-shrink-0 s-5"),
	small: twStyle("-mx-0.5 flex-shrink-0 s-4"),
}

export function buttonIconStyle({
	size = "default",
	className,
}: Pick<ButtonStyleProps, "size" | "className"> = {}) {
	return buttonIconSizeStyles[size](className)
}
