import { autoRef } from "~/helpers/autoRef.ts"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { twStyle, type TwStyle } from "~/styles/twStyle.ts"
import { LucideLoader2 } from "lucide-react"
import type { ClassNameValue } from "tailwind-merge"
import type { StrictOmit } from "~/helpers/types.ts"
import { twMerge } from "~/styles/twMerge.ts"

export interface ButtonProps
	extends React.ComponentPropsWithRef<"button">,
		StrictOmit<ButtonStyleProps, "className"> {
	asChild?: boolean
	icon?: { start: ButtonIconComponent } | { end: ButtonIconComponent }
	pending?: boolean
}

export type ButtonIconComponent = (props: {
	className: string
	"aria-hidden": true
}) => React.ReactNode

export const Button = autoRef(function Button(props: ButtonProps) {
	const {
		asChild,
		appearance = "solid",
		size = "default",
		icon: iconProp,
		pending,
		disabled,
		children,
		className,
		square,
		...buttonProps
	} = props

	let iconStart, iconEnd
	if (iconProp) {
		const iconStyle = buttonIconSizeStyles[size]
		if ("start" in iconProp) {
			iconStart =
				pending ?
					<LucideLoader2 aria-hidden className={iconStyle("animate-spin")} />
				:	<iconProp.start aria-hidden className={iconStyle()} />
		}
		if ("end" in iconProp) {
			iconEnd =
				pending ?
					<LucideLoader2 aria-hidden className={iconStyle("animate-spin")} />
				:	<iconProp.end aria-hidden className={iconStyle()} />
		}
	}

	const Component = asChild ? Slot : "button"
	return (
		<Component type="button" {...buttonProps} className={buttonStyle(props)}>
			{iconStart}
			<Slottable>{children}</Slottable>
			{iconEnd}
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
	appearance = "solid",
	size = "default",
	square,
	className,
}: ButtonStyleProps) {
	return twMerge(
		buttonAppearanceStyles[appearance](),
		buttonSizeStyles[size](),
		square && "aspect-square",
		className,
	)
}

const baseAppearanceStyle = twStyle(
	"inline-flex min-h-10 items-center justify-center gap-3 rounded-md border border-transparent px-3 py-1 leading-tight text-white ring-accent-300 transition focus:outline-none focus-visible:ring-2 disabled:opacity-50",
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
	clear: twStyle(baseAppearanceStyle("hover:bg-base-800")),
	outline: twStyle(baseAppearanceStyle("border-base-700 hover:bg-base-800")),
}

const buttonSizeStyles = {
	default: twStyle(),
	small: twStyle("min-h-8 px-2 py-0.5 text-sm"),
}

const buttonIconSizeStyles: Record<keyof typeof buttonSizeStyles, TwStyle> = {
	default: twStyle("-mx-1 flex-shrink-0 s-5"),
	small: twStyle("-mx-0.5 flex-shrink-0 s-4"),
}
