import { api } from "convex/_generated/api.js"
import { useMutation, useQuery } from "convex/react"
import { LucideDices, LucideList } from "lucide-react"
import { type ScrollerProps, Virtuoso } from "react-virtuoso"
import { Button } from "~/components/Button.tsx"
import { CounterInput } from "~/components/CounterInput.tsx"
import {
	Dialog,
	DialogTrigger,
	SimpleDialogContent,
} from "~/components/Dialog.tsx"
import {
	Field,
	FieldInput,
	FieldLabel,
	FieldLabelText,
} from "~/components/Field.tsx"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import {
	ScrollAreaRoot,
	ScrollAreaScrollbar,
	ScrollAreaViewport,
} from "~/components/ScrollArea.tsx"
import { autoRef } from "~/helpers/autoRef.tsx"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { panel } from "~/styles/panel.ts"
import { EmptyState } from "../../components/EmptyState.tsx"
import { DiceRollDetails } from "./DiceRollDetails.tsx"

export function DiceRolls() {
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			<div className="-mt-px flex-1">
				<DiceRollList />
			</div>
			<DiceRollForm />
		</div>
	)
}

function DiceRollList() {
	const pageSize = 5
	const listResult = useQuery(api.diceRolls.list, { limit: pageSize })
	const characters = useQuery(api.characters.list)
	const charactersById = new Map(
		characters?.map((character) => [character._id, character]),
	)

	return (
		listResult == null ? <LoadingPlaceholder />
		: listResult.page.length === 0 && listResult.isDone ?
			<EmptyState icon={LucideDices}>Nothing yet!</EmptyState>
		:	<div className="flex flex-col gap-2 p-2">
				{!listResult.isDone && (
					<Dialog>
						<DialogTrigger asChild>
							<Button appearance="outline" icon={{ start: LucideList }}>
								Show All
							</Button>
						</DialogTrigger>
						<SimpleDialogContent title="Dice Rolls">
							<div className="h-[calc(100vh-16rem)]">
								<FullDiceRollList />
							</div>
						</SimpleDialogContent>
					</Dialog>
				)}
				<ul className="contents">
					{/* we need to slice since new items can make the page bigger (lol) */}
					{listResult.page
						.slice(0, pageSize)
						.toReversed()
						.map((roll) => (
							<li
								key={roll._id}
								className={panel("animate-flash-accent rounded-md border p-2")}
							>
								<DiceRollDetails
									roll={roll}
									character={
										roll.characterId ?
											charactersById.get(roll.characterId)
										:	undefined
									}
								/>
							</li>
						))}
				</ul>
			</div>
	)
}

function FullDiceRollList() {
	const listResult = useQuery(api.diceRolls.list, {})
	const characters = useQuery(api.characters.list)
	const charactersById = new Map(
		characters?.map((character) => [character._id, character]),
	)

	return (
		<ScrollAreaRoot className="h-full">
			{listResult == null ?
				<LoadingPlaceholder />
			:	<Virtuoso
					increaseViewportBy={1800}
					data={listResult.page}
					itemContent={(_index, roll) => (
						<div className={panel("rounded-md border p-2")}>
							<DiceRollDetails
								roll={roll}
								character={
									roll.characterId ?
										charactersById.get(roll.characterId)
									:	undefined
								}
							/>
						</div>
					)}
					components={{
						Scroller: VirtuosoScroller,
					}}
				/>
			}
			<ScrollAreaScrollbar />
		</ScrollAreaRoot>
	)
}

const VirtuosoScroller = autoRef(function VirtuosoScroller(
	props: ScrollerProps,
) {
	return (
		<ScrollAreaViewport
			{...props}
			style={{ ...props.style, transform: "translateZ(0)" }}
		/>
	)
})

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
