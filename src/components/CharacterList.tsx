import { api } from "convex/_generated/api"
import { type Id } from "convex/_generated/dataModel"
import { type Character } from "convex/characters"
import { useMutation } from "convex/react"
import { LucidePlus, LucideUser } from "lucide-react"
import { startTransition, useTransition } from "react"
import { useSpinDelay } from "spin-delay"
import { useAsyncCallback } from "../helpers/useAsyncCallback"
import { useQuerySuspense } from "../helpers/useQuerySuspense"
import { LoadingSpinner } from "./LoadingPlaceholder"

export function CharacterList({
	selectedCharacterId,
	onSelectCharacter,
}: {
	selectedCharacterId: Id<"characters"> | undefined
	onSelectCharacter: (id: Id<"characters">) => void
}) {
	const characters = useQuerySuspense(api.characters.list)
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			<NewCharacterButton onSuccess={onSelectCharacter} />
			{characters.length === 0 ? (
				<p className="px-3 py-2 opacity-75">No characters found.</p>
			) : (
				<ul className="min-h-0 flex-1 overflow-y-auto">
					{characters
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((character) => (
							<li key={character._id}>
								<CharacterListItem
									selected={character._id === selectedCharacterId}
									character={character}
									onClick={onSelectCharacter}
								/>
							</li>
						))}
				</ul>
			)}
		</div>
	)
}

function CharacterListItem({
	character,
	selected,
	onClick,
}: {
	character: Character
	selected: boolean
	onClick: (id: Id<"characters">) => void
}) {
	const [isPending, startTransition] = useTransition()
	const isPendingDelayed = useSpinDelay(isPending)
	return (
		<button
			data-selected={selected}
			className="flex w-full gap-2 p-2 opacity-60 transition hover:bg-base-800 hover:opacity-100 data-[selected=true]:opacity-100"
			onClick={() => {
				startTransition(() => {
					onClick(character._id)
				})
			}}
		>
			{isPendingDelayed ? <LoadingSpinner /> : <LucideUser />}
			{character.name}
		</button>
	)
}

function NewCharacterButton({
	onSuccess,
}: {
	onSuccess: (id: Id<"characters">) => void
}) {
	const [handleClick, state] = useAsyncCallback(
		useMutation(api.characters.create),
		{
			onSuccess(result) {
				startTransition(() => {
					onSuccess(result.id)
				})
			},
		},
	)

	return (
		<button
			className="flex gap-2 p-2 opacity-75 transition hover:bg-base-800 hover:opacity-100 disabled:opacity-50"
			onClick={() => {
				handleClick({})
			}}
			disabled={state.isLoading}
		>
			{state.isLoading ? <LoadingSpinner /> : <LucidePlus />} New Character
		</button>
	)
}
