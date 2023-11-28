import * as BasePopover from "@radix-ui/react-popover"
import {
	radixAnimationFade,
	radixAnimationSlideBottom,
} from "~/styles/radixAnimations.ts"
import { panel } from "../styles/panel.ts"

export const Popover = BasePopover.Root
export const PopoverTrigger = BasePopover.Trigger
export const PopoverClose = BasePopover.Close

export interface PopoverPanelProps extends BasePopover.PopoverContentProps {
	children: React.ReactNode
	className?: string
}

export function PopoverPanel({
	children,
	className,
	...props
}: PopoverPanelProps) {
	return (
		<BasePopover.Portal>
			<>
				<BasePopover.Content
					sideOffset={8}
					{...props}
					className={panel(
						radixAnimationSlideBottom(),
						radixAnimationFade(),
						"origin-[--radix-popover-content-transform-origin] overflow-clip rounded-md border bg-base-950 shadow-md focus-visible:ring-0",
						className,
					)}
				>
					{children}
				</BasePopover.Content>
			</>
		</BasePopover.Portal>
	)
}
