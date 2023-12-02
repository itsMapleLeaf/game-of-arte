import { api } from "convex/_generated/api.js"
import type { ClientDiceRoll } from "convex/diceRolls.ts"
import { useQuery } from "convex/react"
import type { PaginationResult } from "convex/server"
import { LucideDices, LucideList } from "lucide-react"
import { useEffect, useRef } from "react"
import { type ScrollerProps, Virtuoso } from "react-virtuoso"
import { Button } from "~/components/Button.tsx"
import {
	Dialog,
	DialogTrigger,
	SimpleDialogContent,
} from "~/components/Dialog.tsx"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import {
	ScrollAreaRoot,
	ScrollAreaScrollbar,
	ScrollAreaViewport,
} from "~/components/ScrollArea.tsx"
import { autoRef } from "~/helpers/autoRef.tsx"
import { panel } from "~/styles/panel.ts"
import { EmptyState } from "../../components/EmptyState.tsx"
import { DiceRollDetails } from "./DiceRollDetails.tsx"

export function DiceRollList({
	listResult,
	recentRollId,
}: {
	listResult: PaginationResult<ClientDiceRoll>
	recentRollId: string | undefined
}) {
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
					{listResult.page.toReversed().map((roll) => (
						<ListItem key={roll._id} active={roll._id === recentRollId}>
							<DiceRollDetails
								roll={roll}
								character={
									roll.characterId ?
										charactersById.get(roll.characterId)
									:	undefined
								}
							/>
						</ListItem>
					))}
				</ul>
			</div>
	)
}

function ListItem({
	active,
	children,
}: {
	active: boolean
	children: React.ReactNode
}) {
	const ref = useRef<HTMLLIElement>(null)

	useEffect(() => {
		if (!active) return
		void (async () => {
			// this could fail in various ways - let's not take chances
			try {
				ref.current?.scrollIntoView({ behavior: "smooth" })
			} catch (error) {
				console.error("Failed to scroll to dice roll element:", error)
			}
		})()
	}, [active])

	return (
		<li
			className={panel(
				"rounded-md border p-2",
				active && "animate-flash-accent",
			)}
			ref={ref}
		>
			{children}
		</li>
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
