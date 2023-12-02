import { api } from "convex/_generated/api.js"
import type { Doc, Id } from "convex/_generated/dataModel.js"
import type { ClientDiceRoll } from "convex/diceRolls.ts"
import { useMutation } from "convex/react"
import { LucideEye, LucideEyeOff, LucideX } from "lucide-react"
import { startTransition, useEffect, useState } from "react"
import { Button } from "~/components/Button.tsx"
import { EmptyState } from "~/components/EmptyState.tsx"
import { SrOnly } from "~/components/SrOnly.tsx"
import { sum } from "~/helpers/math.ts"
import { plural } from "~/helpers/string.ts"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { parseCharacterData } from "../characters/data.ts"
import { parseDiceHints } from "./DiceHint.ts"
import { DieResult, DieTooltip } from "./DieResult.tsx"

export function DiceRollDetails({
	roll,
	character,
}: {
	roll: ClientDiceRoll
	character: Doc<"characters"> | undefined
}) {
	const successCounts = roll.dice.flatMap((die) => die.successes ?? [])

	const totalSuccesses =
		successCounts.length > 0 ? sum(successCounts) : undefined

	const hints = parseDiceHints(roll.hints)

	// defer rendering for perf, the tooltip is expensive when we render a lot of them
	const [tooltipsRendered, setTooltipsRendered] = useState(false)
	useEffect(() => {
		startTransition(() => {
			setTooltipsRendered(true)
		})
	}, [])

	return roll.visible ?
			<div className="grid content-between gap-2">
				{roll.label && (
					<h2 className="text-lg/tight font-light">{roll.label}</h2>
				)}
				<ul className="group/diecon-list -mx-1 flex flex-wrap items-center">
					{roll.dice.map((die, index) =>
						tooltipsRendered ?
							// biome-ignore lint/suspicious/noArrayIndexKey: no better key
							<DieTooltip die={die} key={index}>
								<DieResult die={die} />
							</DieTooltip>
							// biome-ignore lint/suspicious/noArrayIndexKey: no better key
						:	<DieResult die={die} key={index} />,
					)}
				</ul>
				<p className="text-sm leading-tight">
					{totalSuccesses != null && (
						<>
							<span
								className={
									totalSuccesses > 0 ? "text-green-300" : "text-red-300"
								}
							>
								{plural(totalSuccesses, "success", { pluralWord: "successes" })}
							</span>
							{" • "}
						</>
					)}
					<span className="text-base-400">rolled by</span> {roll.initiatorName}
				</p>

				{roll.secret && (
					<aside className="flex items-center gap-1 text-sm opacity-50 transition-opacity hover:opacity-100">
						<LucideEyeOff className="inline-block s-5" aria-hidden />
						<p>Only visible to you and the GM.</p>
					</aside>
				)}

				<div className="flex gap-1 empty:hidden">
					{roll.secret && <RevealRollButton roll={roll} />}
					{hints.has("collectResilience") && character && (
						<ResilienceActions roll={roll} character={character} />
					)}
				</div>
			</div>
		:	<EmptyState icon={LucideEyeOff} className="p-2">
				This roll is a secret.
			</EmptyState>
}

function RevealRollButton({ roll }: { roll: { _id: Id<"diceRolls"> } }) {
	const reveal = useMutation(api.diceRolls.reveal)
	return (
		<Button
			appearance="outline"
			size="small"
			onClick={() => reveal({ rollId: roll._id })}
			icon={{ start: LucideEye }}
		>
			Reveal
		</Button>
	)
}

function ResilienceActions({
	roll,
	character,
}: {
	roll: ClientDiceRoll
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
		<>
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
				onClick={async () => {
					await setHints({ rollId: roll._id, hints: [] })
				}}
				icon={{ start: LucideX }}
			>
				<SrOnly>Hide resilience button</SrOnly>
			</Button>
		</>
	)
}
