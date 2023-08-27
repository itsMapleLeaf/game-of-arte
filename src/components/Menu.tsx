import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { panel } from "../styles/panel.ts"

export const Menu = DropdownMenu.Root
export const MenuTrigger = DropdownMenu.Trigger

export function MenuPanel(props: DropdownMenu.DropdownMenuContentProps) {
	return (
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				sideOffset={8}
				{...props}
				className={panel(
					"min-w-32 overflow-clip rounded-md border shadow-md focus-visible:ring-0",
					props.className,
				)}
			/>
		</DropdownMenu.Portal>
	)
}

export function MenuItem(props: DropdownMenu.DropdownMenuItemProps) {
	return (
		<DropdownMenu.Item
			{...props}
			className={panel(
				"flex w-full cursor-pointer items-center gap-2 px-2 py-2 transition focus-visible:ring-0 data-[highlighted]:bg-base-800",
				props.className,
			)}
		/>
	)
}
