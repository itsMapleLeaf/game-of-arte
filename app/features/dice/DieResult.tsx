import type { Die } from "convex/diceRolls.validators.ts"
import { LucideStar, LucideX } from "lucide-react"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/Tooltip.tsx"
import { autoRef } from "~/helpers/autoRef.tsx"
import { twMerge } from "~/styles/twMerge.ts"
import { DieIcon } from "./DieIcon"

export const DieResult = autoRef(function DieResult({
	die,
	...props
}: React.ComponentPropsWithRef<"li"> & { die: Die }) {
	return (
		<li
			{...props}
			className={twMerge(
				"relative flex cursor-default items-center justify-center rounded transition s-10 hover:!opacity-100 focus-visible:!opacity-100 group-hover/diecon-list:opacity-50 group-[:has(:focus-within)]/diecon-list:opacity-50",
				die.color === "positive" && "text-blue-400",
				die.color === "critical" && "text-green-400",
				die.color === "negative" && "text-red-400",
				props.className,
			)}
		>
			<DieIcon sides={die.sides} className="s-10" strokeWidth={1} />

			<span
				className={twMerge(
					"absolute",
					(die.sides === 4 || die.sides === 12) && "translate-y-[2px]",
				)}
			>
				{die.face === "blank" ?
					null
				: die.face === "success" ?
					<LucideStar className="s-4" />
				: die.face === "fail" ?
					<LucideX className="s-4" />
				:	die.result}
			</span>
		</li>
	)
})

export function DieTooltip({
	die,
	children,
}: {
	die: Die
	children: React.ReactElement
}) {
	return (
		<Tooltip disableHoverableContent>
			<TooltipTrigger tabIndex={0} asChild>
				{children}
			</TooltipTrigger>
			<TooltipContent className="pointer-events-none">
				{die.tooltip ?? `d${die.sides}: ${die.result}`}
			</TooltipContent>
		</Tooltip>
	)
}
