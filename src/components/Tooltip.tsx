import * as TooltipBase from "@radix-ui/react-tooltip"
import { panel } from "~/styles/panel.ts"
import {
	radixAnimationFade,
	radixAnimationSlideBottom,
} from "~/styles/radixAnimations.ts"

export const TooltipProvider = TooltipBase.Provider
export const Tooltip = TooltipBase.Root
export const TooltipTrigger = TooltipBase.Trigger

export function TooltipContent(props: TooltipBase.TooltipContentProps) {
	return (
		<TooltipBase.Content
			{...props}
			className={panel(
				"rounded border p-1.5 text-sm leading-none shadow-md",
				radixAnimationFade(),
				radixAnimationSlideBottom(),
				props.className,
			)}
		/>
	)
}
