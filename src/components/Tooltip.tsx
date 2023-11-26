import * as TooltipBase from "@radix-ui/react-tooltip"
import { panel } from "~/styles/panel.ts"

export const TooltipProvider = TooltipBase.Provider
export const Tooltip = TooltipBase.Root
export const TooltipTrigger = TooltipBase.Trigger

export function TooltipContent(props: TooltipBase.TooltipContentProps) {
	return (
		<TooltipBase.Portal>
			<TooltipBase.Content
				{...props}
				className={panel(
					"origin-[--radix-tooltip-content-transform-origin] rounded border p-1.5 text-sm leading-none shadow-md data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in data-[state=delayed-open]:zoom-in-75",
					props.className,
				)}
			/>
		</TooltipBase.Portal>
	)
}
