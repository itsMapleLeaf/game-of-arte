import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { panel } from "../styles/panel.ts"

export const Menu = DropdownMenu.Root
export const MenuTrigger = DropdownMenu.Trigger

export function MenuPanel({
	children,
	...props
}: {
	side: NonNullable<DropdownMenu.DropdownMenuContentProps["side"]>
	align: NonNullable<DropdownMenu.DropdownMenuContentProps["align"]>
	children: React.ReactNode
}) {
	return (
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				{...props}
				className={panel(
					"min-w-32 overflow-clip rounded-md border shadow-md focus-visible:ring-0",
				)}
				sideOffset={8}
			>
				{children}
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	)
}

export function MenuItem(props: DropdownMenu.DropdownMenuItemProps) {
	return (
		<DropdownMenu.Item
			{...props}
			className={panel(
				"flex cursor-pointer items-center gap-2 px-2 py-2 transition focus-visible:ring-0 data-[highlighted]:bg-base-800",
				props.className,
			)}
		/>
	)
}
