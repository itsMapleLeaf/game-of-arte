import { api } from "convex/_generated/api.js"
import type { Id } from "convex/_generated/dataModel.js"
import type { DiceRollListItem } from "convex/diceRolls.ts"
import { useMutation } from "convex/react"
import { LucideDices, LucideHexagon } from "lucide-react"
import { Virtuoso } from "react-virtuoso"
import { CounterInput } from "~/components/CounterInput.tsx"
import {
	Field,
	FieldInput,
	FieldLabel,
	FieldLabelText,
} from "~/components/Field.tsx"
import { LoadingSuspense } from "~/components/LoadingPlaceholder.tsx"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { useQuerySuspense } from "~/helpers/useQuerySuspense.ts"

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
	return (
		<Virtuoso
			data={rolls}
			computeItemKey={(_index, roll) => roll._id}
			itemContent={(_index, roll) => <DiceRollDetails roll={roll} />}
			initialTopMostItemIndex={rolls.length - 1}
			followOutput
			alignToBottom
		/>
	)
}

function DiceRollDetails({ roll }: { roll: DiceRollListItem }) {
	const isAction = roll.type === "action"

	const isSuccess = (result: number) => result >= 9 && result <= 11
	const isCriticalSuccess = (result: number) => result === 12

	const dice = isAction
		? roll.dice.toSorted((a, b) => b.result - a.result)
		: roll.dice

	const successCount = roll.dice
		.map((r) => (isCriticalSuccess(r.result) ? 2 : isSuccess(r.result) ? 1 : 0))
		.reduce<number>((a, b) => a + b, 0)

	return (
		<div className="grid content-between gap-2 border-t border-base-800 px-2 py-3">
			{roll.label && <h2 className="text-lg/tight font-light">{roll.label}</h2>}
			<ul className="-mx-1 flex flex-wrap items-center">
				{dice.map((die, index) =>
					isAction ? (
						<Diecon
							// biome-ignore lint/suspicious/noArrayIndexKey: no better key to use
							key={index}
							result={die.result}
							success={isSuccess(die.result)}
							crit={isCriticalSuccess(die.result)}
						/>
					) : (
						// biome-ignore lint/suspicious/noArrayIndexKey: no better key to use
						<Diecon key={index} result={die.result} />
					),
				)}
			</ul>
			<p className="text-sm leading-tight">
				{isAction && (
					<>
						<span
							data-success={successCount > 0}
							data-fail={successCount === 0}
							className="data-[fail=true]:text-red-300 data-[success=true]:text-green-300"
						>
							{successCount} success{successCount === 1 ? "" : "es"}
						</span>
						{" • "}
					</>
				)}
				<span className="text-base-400">rolled by</span> {roll.initiatorName}
			</p>
			{isAction && successCount === 0 && !roll.resilienceCollected && (
				<CollectResilienceButton rollId={roll._id} />
			)}
		</div>
	)
}

function Diecon({
	result,
	success,
	crit,
}: {
	result: number
	success?: boolean
	crit?: boolean
}) {
	return (
		<li
			data-success={success}
			data-crit={crit}
			className="relative flex items-center justify-center data-[crit=true]:text-green-400 data-[success=true]:text-blue-400"
		>
			<LucideHexagon className="s-10" strokeWidth={1} />
			<span className="absolute">{result}</span>
		</li>
	)
}

function CollectResilienceButton({ rollId }: { rollId: Id<"diceRolls"> }) {
	const [collectResilience, state] = useAsyncCallback(
		useMutation(api.diceRolls.collectResilience),
	)

	if (state.isLoading) {
		return null
	}

	return (
		<button
			type="button"
			className="justify-self-start rounded border border-base-600 bg-base-700/50 p-1.5 text-sm leading-none transition hover:bg-base-800"
			onClick={() => {
				collectResilience({ id: rollId })
			}}
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