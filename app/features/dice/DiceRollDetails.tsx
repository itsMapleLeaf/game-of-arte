import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel.js"
import type { DiceRollListItem } from "convex/diceRolls.ts"
import { useMutation } from "convex/react"
import { LucideX } from "lucide-react"
import { Button } from "~/components/Button.tsx"
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
						<DieResult die={die} />
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
