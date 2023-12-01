import { Slot, Slottable } from "@radix-ui/react-slot"
import { LucideLoader2 } from "lucide-react"
import type { ClassNameValue } from "tailwind-merge"
import { autoRef } from "~/helpers/autoRef.tsx"
import type { StrictOmit } from "~/helpers/types.ts"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { type TwStyle, twStyle } from "~/styles/twStyle.ts"

export interface ButtonProps
	extends StrictOmit<React.ComponentPropsWithRef<"button">, "onClick">,
		StrictOmit<ButtonStyleProps, "className"> {
	asChild?: boolean
	icon?: { start: ButtonIconComponent } | { end: ButtonIconComponent }
	pending?: boolean
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => unknown
}

export type ButtonIconComponent = (props: {
	className: string
	"aria-hidden": true
}) => React.ReactNode

export const Button = autoRef(function Button(props: ButtonProps) {
	const [handleClick, state] = useAsyncCallback(
		async (event: React.MouseEvent<HTMLButtonElement>) => {
			await props.onClick?.(event)
		},
	)

	const {
		asChild,
		size = "default",
		icon: iconProp,
		pending = state.isLoading,
		children,
		appearance: _appearance,
		square: _square,
		onClick,
		...buttonProps
	} = props

	let iconStart
	let iconEnd
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
		<Component
			type="button"
			{...buttonProps}
			className={buttonStyle(props)}
			onClick={handleClick}
		>
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
	"inline-flex min-h-10 items-center justify-center gap-3 rounded-md border border-transparent px-3 py-2 leading-tight text-white ring-accent-300 transition focus:outline-none focus-visible:ring-2 disabled:opacity-50",
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
	default: twStyle(),
	small: twStyle("min-h-8 px-2 py-0.5 text-sm"),
}

const buttonIconSizeStyles: Record<keyof typeof buttonSizeStyles, TwStyle> = {
	default: twStyle("-mx-1 flex-shrink-0 s-5"),
	small: twStyle("-mx-0.5 flex-shrink-0 s-4"),
}
