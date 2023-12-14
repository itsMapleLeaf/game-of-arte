import { Slot, Slottable } from "@radix-ui/react-slot"
import { LucideLoader2 } from "lucide-react"
import type { ForwardedRef } from "react"
import type { ClassValue, VariantProps } from "tailwind-variants"
import { autoRef } from "~/helpers/autoRef.tsx"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { twVariants } from "./twVariants.ts"

export interface ButtonProps extends VariantProps<typeof buttonStyle> {
	type?: "button" | "submit" | "reset"
	children?: React.ReactNode
	className?: ClassValue
	asChild?: boolean
	icon?: ButtonIconComponent
	iconPosition?: "start" | "end"
	pending?: boolean
	pendingIcon?: ButtonIconComponent
	ref?: ForwardedRef<HTMLButtonElement>
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
	pendingIcon: PendingIconComponent = LucideLoader2,
	children,
	appearance = "solid",
	square = false,
	color,
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
			<PendingIconComponent
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
				color,
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

export const buttonStyle = twVariants({
	base: "inline-flex items-center justify-center rounded-md border border-transparent leading-tight text-white ring-accent-300 transition focus:outline-none focus-visible:ring-2 disabled:opacity-50",
	variants: {
		appearance: {
			solid: `border-[--button-bg] bg-[--button-bg-25] text-base-50 hover:bg-[--button-bg-50]`,
			outline: `border-[--button-bg] text-base-50 hover:bg-[--button-bg-25]`,
			clear: `text-[--button-text] hover:bg-[--button-bg-25]`,
			faded: `text-[--button-text-50] hover:text-[--button-text] focus-visible:text-[--button-text]`,
		},
		color: {
			default: `
				[--button-bg-25:theme(colors.base.700/0.25)]
				[--button-bg-50:theme(colors.base.700/0.50)]
				[--button-bg:theme(colors.base.700)]
				[--button-text-50:theme(colors.base.50/0.50)]
				[--button-text:theme(colors.base.50)]
			`,
			accent: `
				[--button-bg-25:theme(colors.accent.700/0.25)]
				[--button-bg-50:theme(colors.accent.700/0.50)]
				[--button-bg:theme(colors.accent.700)]
				[--button-text-50:theme(colors.accent.400/0.50)]
				[--button-text:theme(colors.accent.400)]
			`,
			negative: `
				[--button-bg-25:theme(colors.error.700/0.25)]
				[--button-bg-50:theme(colors.error.700/0.50)]
				[--button-bg:theme(colors.error.700)]
				[--button-text-50:theme(colors.error.400/0.50)]
				[--button-text:theme(colors.error.400)]
			`,
		},
		size: {
			small: `min-h-8 gap-2 px-2 py-1 text-sm`,
			default: `min-h-10 gap-3 px-3 py-2 text-base`,
			large: `min-h-12 gap-4 px-5 py-2 text-lg`,
		},
		square: {
			true: "aspect-square",
		},
	},
	defaultVariants: {
		appearance: "solid",
		color: "default",
	},
})

export const buttonIconStyle = twVariants({
	base: "flex-shrink-0",
	variants: {
		size: {
			small: "-mx-0.5 s-4",
			default: "-mx-1 s-5",
			large: "-mx-1.5 s-6",
		},
	},
	defaultVariants: {
		size: "default",
	},
})
