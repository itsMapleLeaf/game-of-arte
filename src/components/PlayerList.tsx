import { api } from "convex/_generated/api.js"
import { type Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { LucideUserPlus, LucideX } from "lucide-react"
import { useRef } from "react"
import { useSpinDelay } from "spin-delay"
import { parseNonNil } from "../helpers/errors.ts"
import { useAsyncCallback } from "../helpers/useAsyncCallback.ts"
import { useQuerySuspense } from "../helpers/useQuerySuspense.ts"
import { LoadingSpinner } from "./LoadingPlaceholder.tsx"

export function PlayerList() {
	const players = useQuerySuspense(api.players.list)
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			<NewPlayerForm />
			{players.length === 0 ? (
				<p className="p-3">No players have been added yet.</p>
			) : (
				<ul className="min-h-0 flex-1 overflow-y-auto">
					{players.map((player) => (
						<li key={player._id}>
							<PlayerListItem player={player} />
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

function NewPlayerForm() {
	const formRef = useRef<HTMLFormElement>(null)

	const [addPlayer, state] = useAsyncCallback(useMutation(api.players.add), {
		onSuccess() {
			parseNonNil(formRef.current).reset()
		},
	})

	const isLoading = useSpinDelay(state.isLoading)

	return (
		<form
			ref={formRef}
			className="flex divide-x divide-base-800"
			onSubmit={(event) => {
				const formData = new FormData(event.currentTarget)
				event.preventDefault()
				addPlayer({
					discordUserId: formData.get("discordUserId") as string,
				})
			}}
		>
			<input
				type="text"
				name="discordUserId"
				className="min-w-0 flex-1 bg-transparent px-3"
				placeholder="Discord User ID (e.g. 123456789012345678)"
			/>
			<button type="submit" className="p-2">
				{isLoading ? <LoadingSpinner /> : <LucideUserPlus />}
				<span className="sr-only">Add Player</span>
			</button>
		</form>
	)
}

function PlayerListItem({
	player,
}: {
	player: Doc<"players"> & { name: string | undefined }
}) {
	const [removePlayer, state] = useAsyncCallback(
		useMutation(api.players.remove),
	)
	const isLoading = useSpinDelay(state.isLoading)

	return (
		<div className="flex items-center">
			<p className="flex-1 px-3 py-2 leading-tight">
				{player.name ?? <span className="opacity-75">Unknown</span>} (
				{player.discordUserId})
			</p>
			<button
				className="p-2 opacity-50 transition hover:opacity-100"
				onClick={() => {
					removePlayer({ id: player._id })
				}}
			>
				{isLoading ? <LoadingSpinner /> : <LucideX />}
				<span className="sr-only">Remove Player</span>
			</button>
		</div>
	)
}
