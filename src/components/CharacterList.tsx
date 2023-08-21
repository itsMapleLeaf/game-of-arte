import { api } from "convex/_generated/api"
import { type Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { LucidePlus, LucideUser } from "lucide-react"
import { startTransition, useTransition } from "react"
import { useSpinDelay } from "spin-delay"
import { useAppParams } from "../helpers/useAppParams.ts"
import { useAsyncCallback } from "../helpers/useAsyncCallback.ts"
import { useQuerySuspense } from "../helpers/useQuerySuspense.ts"
import { LoadingSpinner } from "./LoadingPlaceholder.tsx"

export function CharacterList() {
	const characters = useQuerySuspense(api.characters.list)
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			<NewCharacterButton />
			{characters.length === 0 ? (
				<p className="px-3 py-2 opacity-75">No characters found.</p>
			) : (
				<ul className="min-h-0 flex-1 overflow-y-auto">
					{characters
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((character) => (
							<li key={character._id}>
								<CharacterListItem character={character} />
							</li>
						))}
				</ul>
			)}
		</div>
	)
}

function CharacterListItem({ character }: { character: Doc<"characters"> }) {
	const [isPending, startTransition] = useTransition()
	const isPendingDelayed = useSpinDelay(isPending)
	const appParams = useAppParams()
	return (
		<button
			data-selected={appParams.characterId.current === character._id}
			className="flex w-full gap-2 p-2 opacity-60 transition hover:bg-base-800 hover:opacity-100 data-[selected=true]:opacity-100"
			onClick={() => {
				startTransition(() => {
					appParams.characterId.push(character._id)
				})
			}}
		>
			{isPendingDelayed ? <LoadingSpinner /> : <LucideUser />}
			{character.name}
		</button>
	)
}

function NewCharacterButton() {
	const appParams = useAppParams()
	const [handleClick, state] = useAsyncCallback(
		useMutation(api.characters.create),
		{
			onSuccess(result) {
				startTransition(() => {
					appParams.characterId.push(result._id)
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
