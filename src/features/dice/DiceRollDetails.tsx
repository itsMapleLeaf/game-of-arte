import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel.js"
import type { DiceRollListItem } from "convex/diceRolls.ts"
import type { Die } from "convex/diceRolls.validators.ts"
import { useMutation } from "convex/react"
import {
	LucideDiamond,
	LucideHexagon,
	LucidePentagon,
	LucideSquare,
	LucideStar,
	LucideTriangle,
	LucideX,
} from "lucide-react"
import { startTransition, useEffect, useState } from "react"
import { Button } from "~/components/Button.tsx"
import { SrOnly } from "~/components/SrOnly.tsx"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/Tooltip.tsx"
import { autoRef } from "~/helpers/autoRef.tsx"
import { plural } from "~/helpers/index.ts"
import { sum } from "~/helpers/math.ts"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { parseCharacterData } from "../characters/data.ts"
import { parseDiceHints } from "./DiceHint.ts"

export function DiceRollDetails({
	roll,
	character,
}: {
	roll: DiceRollListItem
	character: Doc<"characters"> | undefined
}) {
	const successCounts = roll.dice.flatMap((die) => die.successes ?? [])

	const totalSuccesses =
		successCounts.length > 0 ? sum(successCounts) : undefined

	const hints = parseDiceHints(roll.hints)

	return (
		<div className="grid content-between gap-2">
			{roll.label && <h2 className="text-lg/tight font-light">{roll.label}</h2>}
			<ul className="group/diecon-list -mx-1 flex flex-wrap items-center">
				{roll.dice.map((die, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: no better key
					<DieTooltip die={die} key={index}>
						<Diecon die={die} />
					</DieTooltip>
				))}
			</ul>
			<p className="text-sm leading-tight">
				{totalSuccesses != null && (
					<>
						<span
							className={totalSuccesses > 0 ? "text-green-300" : "text-red-300"}
						>
							{plural(totalSuccesses, "success", { pluralWord: "successes" })}
						</span>
						{" • "}
					</>
				)}
				<span className="text-base-400">rolled by</span> {roll.initiatorName}
			</p>
			{hints.has("collectResilience") && character && (
				<CollectResilienceButton roll={roll} character={character} />
			)}
		</div>
	)
}

const Diecon = autoRef(function Diecon({
	die,
	...props
}: React.ComponentPropsWithRef<"li"> & { die: Die }) {
	return (
		<li
			{...props}
			className={twMerge(
				"relative flex cursor-default items-center justify-center rounded transition hover:!opacity-100 focus-visible:!opacity-100 group-hover/diecon-list:opacity-50 group-[:has(:focus-within)]/diecon-list:opacity-50",
				die.color === "positive" && "text-blue-400",
				die.color === "critical" && "text-green-400",
				die.color === "negative" && "text-red-400",
				props.className,
			)}
		>
			{die.sides === 4 ?
				<LucideTriangle className="s-10" strokeWidth={1} />
			: die.sides === 6 ?
				<LucideSquare className="s-10" strokeWidth={1} />
			: die.sides === 8 ?
				<LucideDiamond className="s-10" strokeWidth={1} />
			: die.sides === 12 ?
				<LucidePentagon className="s-10" strokeWidth={1} />
			:	<LucideHexagon className="s-10" strokeWidth={1} />}

			<span className="absolute translate-y-[3px]">
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

function DieTooltip({
	die,
	children,
}: {
	die: Die
	children: React.ReactElement
}) {
	// delay rendering for perf, the tooltip is expensive when we render a lot of them
	const [renderTooltip, setRenderTooltip] = useState(false)
	useEffect(() => {
		startTransition(() => {
			setRenderTooltip(true)
		})
	}, [])

	return renderTooltip ?
			<Tooltip disableHoverableContent>
				<TooltipTrigger tabIndex={0} asChild>
					{children}
				</TooltipTrigger>
				<TooltipContent className="pointer-events-none">
					{die.tooltip ?? `d${die.sides}: ${die.result}`}
				</TooltipContent>
			</Tooltip>
		:	children
}

function CollectResilienceButton({
	roll,
	character,
}: {
	roll: DiceRollListItem
	character: Doc<"characters">
}) {
	const updateCharacterData = useMutation(api.characters.updateData)
	const setHints = useMutation(api.diceRolls.setHints)

	const [collectResilience, state] = useAsyncCallback(async () => {
		const data = parseCharacterData(character.data)
		await updateCharacterData({
			id: character._id,
			data: { resilience: data.resilience + 1 },
		})
		await setHints({ rollId: roll._id, hints: [] })
	})

	if (state.isLoading) {
		return null
	}

	return (
		<div className="flex gap-1">
			<Button
				appearance="outline"
				size="small"
				pending={state.isLoading}
				onClick={collectResilience}
			>
				+1 Resilience
			</Button>
			<Button
				appearance="outline"
				size="small"
				square
				pending={state.isLoading}
				onClick={collectResilience}
				icon={{ start: LucideX }}
			>
				<SrOnly>Hide resilience button</SrOnly>
			</Button>
		</div>
	)
}
