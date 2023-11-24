import * as BasePopover from "@radix-ui/react-popover"
import {
	radixAnimationFade,
	radixAnimationSlideBottom,
} from "~/styles/radixAnimations.ts"
import { panel } from "../styles/panel.ts"

export const Popover = BasePopover.Root
export const PopoverTrigger = BasePopover.Trigger
export const PopoverClose = BasePopover.Close

export function PopoverPanel({
	children,
	className,
	...props
}: {
	side: NonNullable<BasePopover.PopoverContentProps["side"]>
	align: NonNullable<BasePopover.PopoverContentProps["align"]>
	children: React.ReactNode
	className?: string
}) {
	return (
		<BasePopover.Portal>
			<>
				<BasePopover.Content
					{...props}
					className={panel(
						radixAnimationSlideBottom(),
						radixAnimationFade(),
						"origin-[--radix-popover-content-transform-origin] overflow-clip rounded-md border shadow-md focus-visible:ring-0",
						className,
					)}
					sideOffset={8}
				>
					{children}
				</BasePopover.Content>
			</>
		</BasePopover.Portal>
	)
}
