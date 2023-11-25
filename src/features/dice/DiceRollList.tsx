import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel.js"
import type { DiceRollListItem } from "convex/diceRolls.ts"
import type { Die } from "convex/diceRolls.validators.ts"
import { useMutation } from "convex/react"
import {
	LucideDiamond,
	LucideDices,
	LucideHexagon,
	LucidePentagon,
	LucideSquare,
	LucideStar,
	LucideTriangle,
	LucideX,
} from "lucide-react"
import { Virtuoso } from "react-virtuoso"
import { CounterInput } from "~/components/CounterInput.tsx"
import {
	Field,
	FieldInput,
	FieldLabel,
	FieldLabelText,
} from "~/components/Field.tsx"
import { LoadingSuspense } from "~/components/LoadingPlaceholder.tsx"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/Tooltip.tsx"
import { plural } from "~/helpers/index.ts"
import { sum } from "~/helpers/math.ts"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { useQuerySuspense } from "~/helpers/useQuerySuspense.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { parseCharacterData } from "../characters/data.ts"
import { parseDiceHints } from "./DiceHint.ts"

export function DiceRollList() {
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			<div className="-mt-px flex-1">
				<LoadingSuspense>
					<DiceRollItems />
				</LoadingSuspense>
			</div>
			<DiceRollForm />
		</div>
	)
}

function DiceRollItems() {
	const rolls = useQuerySuspense(api.diceRolls.list)
	const characters = useQuerySuspense(api.characters.list)
	const charactersById = new Map(
		characters.map((character) => [character._id, character]),
	)
	return (
		<Virtuoso
			data={rolls}
			computeItemKey={(_index, roll) => roll._id}
			itemContent={(_index, roll) => (
				<DiceRollDetails
					roll={roll}
					character={
						roll.characterId ? charactersById.get(roll.characterId) : undefined
					}
				/>
			)}
			initialTopMostItemIndex={rolls.length - 1}
			followOutput
			alignToBottom
		/>
	)
}

function DiceRollDetails({
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
		<div className="grid content-between gap-2 border-t border-base-800 px-2 py-3">
			{roll.label && <h2 className="text-lg/tight font-light">{roll.label}</h2>}
			<ul className="-mx-1 flex flex-wrap items-center">
				{roll.dice.map((die, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: no better key
					<Diecon key={index} die={die} />
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

function Diecon({ die }: { die: Die }) {
	return (
		<Tooltip>
			<TooltipTrigger>
				<li
					className={twMerge(
						"relative flex items-center justify-center",
						die.color === "positive" && "text-blue-400",
						die.color === "critical" && "text-green-400",
						die.color === "negative" && "text-red-400",
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
			</TooltipTrigger>
			<TooltipContent className="pointer-events-none">
				{die.tooltip ?? `d${die.sides}: ${die.result}`}
			</TooltipContent>
		</Tooltip>
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
		<button
			type="button"
			className="justify-self-start rounded border border-base-600 bg-base-700/50 p-1.5 text-sm leading-none transition hover:bg-base-800"
			onClick={collectResilience}
		>
			+1 Resilience
		</button>
	)
}

function DiceRollForm() {
	const [roll, state] = useAsyncCallback(useMutation(api.diceRolls.roll))
	return (
		<form
			className="grid grid-cols-[1fr,auto] gap-2 p-2"
			onSubmit={(event) => {
				event.preventDefault()
				const formData = new FormData(event.currentTarget)
				const label = formData.get("label") as string
				const count = Number(formData.get("count"))
				roll({ label, dice: [{ count, sides: 12 }] })
			}}
		>
			<div className="col-span-2">
				<Field>
					<FieldLabel>Label</FieldLabel>
					<FieldInput
						name="label"
						className="h-10 min-w-0 rounded bg-black/50 px-3 leading-none"
						placeholder="Fortune: Escape"
					/>
				</Field>
			</div>
			<Field>
				<FieldLabelText>Dice Count</FieldLabelText>
				<CounterInput
					name="count"
					defaultValue={1}
					min={1}
					className="h-10 border-0 bg-black/50"
				/>
			</Field>
			<button
				type="submit"
				className="flex h-10 items-center gap-2 self-end rounded bg-black/50 px-3"
			>
				<LucideDices className={state.isLoading ? "animate-spin" : ""} />
				Roll
			</button>
		</form>
	)
}
