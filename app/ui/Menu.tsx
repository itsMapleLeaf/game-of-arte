import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { autoRef } from "~/helpers/autoRef.tsx"
import type { StrictOmit } from "~/helpers/types.ts"
import { twMerge } from "~/ui/twMerge.ts"
import {
	Button,
	type ButtonIconComponent,
	type ButtonProps,
} from "./Button.tsx"
import { panel } from "./styles.ts"

export const Menu = DropdownMenu.Root
export const MenuTrigger = DropdownMenu.Trigger

export function MenuPanel(props: DropdownMenu.DropdownMenuContentProps) {
	return (
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				sideOffset={8}
				{...props}
				className={panel(
					"flex min-w-32 flex-col items-start divide-none rounded-md border text-start shadow-md duration-150 focus-visible:ring-0 data-[state=closed]:ease-in data-[state=open]:ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2",
					props.className,
				)}
			/>
		</DropdownMenu.Portal>
	)
}

export interface MenuItemProps
	extends StrictOmit<ButtonProps, "onClick" | "ref">,
		StrictOmit<DropdownMenu.DropdownMenuItemProps, "color" | "className"> {
	icon?: ButtonIconComponent
}

export const MenuItem = autoRef(function MenuItem({
	appearance = "clear",
	size,
	className,
	square,
	children,
	asChild,
	icon,
	...props
}: MenuItemProps) {
	return (
		<DropdownMenu.Item {...props} asChild>
			<Button
				appearance={appearance}
				size={size}
				square={square}
				className={twMerge(
					"w-full justify-start rounded-none first:rounded-t-[inherit] last:rounded-b-[inherit] focus-visible:ring-0",
					className,
				)}
				icon={icon}
				asChild={asChild}
			>
				{children}
			</Button>
		</DropdownMenu.Item>
	)
})
