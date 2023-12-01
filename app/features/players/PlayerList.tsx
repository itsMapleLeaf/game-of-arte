import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel.js"
import { useMutation, useQuery } from "convex/react"
import { LucideUserPlus, LucideX } from "lucide-react"
import { useRef } from "react"
import { useSpinDelay } from "spin-delay"
import { expect } from "~/helpers/expect.ts"
import { AsyncButton } from "../../components/AsyncButton.tsx"
import {
	LoadingPlaceholder,
	LoadingSpinner,
} from "../../components/LoadingPlaceholder.tsx"
import {
	Menu,
	MenuItem,
	MenuPanel,
	MenuTrigger,
} from "../../components/Menu.tsx"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"

export function PlayerList() {
	const players = useQuery(api.players.list)
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			<NewPlayerForm />
			{players === undefined ?
				<LoadingPlaceholder />
			: players.length === 0 ?
				<p className="p-3">No players have been added yet.</p>
			:	<ul className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
					{players.map((player) => (
						<li key={player._id}>
							<PlayerListItem player={player} />
						</li>
					))}
				</ul>
			}
		</div>
	)
}

function NewPlayerForm() {
	const formRef = useRef<HTMLFormElement>(null)

	const [addPlayer, state] = useAsyncCallback(useMutation(api.players.add), {
		onSuccess() {
			expect(formRef.current).reset()
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
				{isLoading ?
					<LoadingSpinner />
				:	<LucideUserPlus />}
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
	const character = useQuery(api.characters.get, {
		id: player.ownedCharacterId,
	})
	const removePlayer = useMutation(api.players.remove)

	return (
		<section className="flex flex-col gap-2">
			<h2 className="text-xl/tight font-light">
				{player.name ?? <span className="opacity-75">Unknown</span>}
			</h2>

			<dl className="grid gap-1.5">
				<div>
					<dt className="text-sm/snug font-medium uppercase text-base-400">
						Discord ID
					</dt>
					<dd className="leading-snug">{player.discordUserId}</dd>
				</div>
				{character && (
					<div>
						<dt className="text-sm/snug font-medium uppercase text-base-400">
							Character
						</dt>
						<dd className="leading-snug">{character.name}</dd>
					</div>
				)}
			</dl>

			<footer className="flex flex-wrap gap-2">
				<AsyncButton
					className="flex items-center gap-1 rounded border border-base-600 bg-base-700/50 p-1.5 text-sm leading-none transition hover:bg-base-800"
					onClick={() => removePlayer({ id: player._id })}
				>
					<LucideX className="-mx-0.5 s-4" /> Remove
				</AsyncButton>
				<SetCharacterMenu player={player} />
			</footer>
		</section>
	)
}

function SetCharacterMenu({ player }: { player: Doc<"players"> }) {
	const characters = useQuery(api.characters.list)
	const updatePlayer = useMutation(api.players.update)

	return characters === undefined ?
			<LoadingSpinner />
		:	<Menu>
				<MenuTrigger className="flex items-center gap-1 rounded border border-base-600 bg-base-700/50 p-1.5 text-sm leading-none transition hover:bg-base-800">
					<LucideUserPlus className="s-4" /> Set Character
				</MenuTrigger>
				<MenuPanel
					side="bottom"
					align="center"
					className="max-h-64 max-w-48 overflow-y-auto"
				>
					{characters.map((character) => (
						<MenuItem key={character._id} asChild>
							<AsyncButton
								onClick={() =>
									updatePlayer({
										id: player._id,
										ownedCharacterId: character._id,
									})
								}
							>
								{character.name}
							</AsyncButton>
						</MenuItem>
					))}
				</MenuPanel>
			</Menu>
}
