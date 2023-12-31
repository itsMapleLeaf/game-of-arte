import { Tooltip, TooltipContent, TooltipTrigger } from "~/ui/Tooltip"
import { twMerge } from "~/ui/twMerge"

export function Indicator({
	label,
	value,
	icon,
	className,
}: {
	label: string
	value: number
	icon?: React.ReactNode
	className?: string
}) {
	return (
		<Tooltip disableHoverableContent>
			<TooltipTrigger tabIndex={0} asChild>
				<span
					className={twMerge(
						"-mx-2 -my-1.5 grid cursor-default grid-cols-[1.5rem,auto] items-center gap-1 rounded-md px-2 py-1.5 tabular-nums transition hover:brightness-150",
						className,
					)}
				>
					<span aria-hidden>{icon}</span>
					{value}
				</span>
			</TooltipTrigger>
			<TooltipContent>
				{value} {label}
			</TooltipContent>
		</Tooltip>
	)
}
