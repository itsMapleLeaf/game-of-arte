import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel.js"
import type { PlayerListResult } from "convex/players.ts"
import { useMutation, useQuery } from "convex/react"
import {
	LucideMailPlus,
	LucideUserPlus,
	LucideUserPlus2,
	LucideUserX2,
	LucideX,
} from "lucide-react"
import { useState } from "react"
import { Button } from "~/components/Button.tsx"
import { EmptyState } from "~/components/EmptyState.tsx"
import { panel } from "~/styles/panel.ts"
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

export function PlayerList() {
	const players = useQuery(api.players.list)
	const invites = useQuery(api.invites.list)
	const createInvite = useMutation(api.invites.create)
	return (
		<div className="grid gap-2">
			<Button icon={LucideUserPlus2} onClick={() => createInvite()}>
				Add Player
			</Button>

			{players === undefined || invites === undefined ?
				<LoadingPlaceholder />
			: players.length === 0 && invites.length === 0 ?
				<EmptyState icon={LucideUserX2}>
					No players have been added yet.
				</EmptyState>
			:	<>
					<ul className="contents">
						{players.map((player) => (
							<li key={player._id}>
								<PlayerListItem player={player} />
							</li>
						))}
					</ul>
					<ul className="contents">
						{invites.map((invite) => (
							<li key={invite._id}>
								<InviteListItem invite={invite} />
							</li>
						))}
					</ul>
				</>
			}
		</div>
	)
}

function PlayerListItem({ player }: { player: PlayerListResult }) {
	const character = useQuery(api.characters.get, {
		id: player.assignedCharacterId,
	})
	const removePlayer = useMutation(api.players.remove)

	return (
		<section className={panel("flex flex-col gap-2 rounded-md border p-2")}>
			<h2 className="text-xl/tight font-light">
				{player.name ?? <span className="opacity-75">Unknown</span>}
			</h2>

			<dl className="grid gap-1.5">
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

function InviteListItem({ invite }: { invite: Doc<"invites"> }) {
	const [copied, setCopied] = useState(false)
	const copyInviteLink = () => {
		navigator.clipboard.writeText(
			`${window.location.origin}/join?invite=${invite._id}`,
		)
		setCopied(true)
		setTimeout(() => setCopied(false), 1000)
	}

	const remove = useMutation(api.invites.remove)

	return (
		<section
			className={panel(
				"flex flex-col items-center gap-4 rounded-md border p-4",
			)}
		>
			<EmptyState icon={LucideMailPlus} className="p-0 py-1">
				Invite someone to fill this slot.
			</EmptyState>
			<div className="flex h-8 flex-wrap items-center justify-center gap-1">
				{copied ?
					<p>Copied!</p>
				:	<>
						<Button
							size="small"
							appearance="outline"
							icon={LucideMailPlus}
							onClick={copyInviteLink}
						>
							Copy Link
						</Button>
						<Button
							size="small"
							appearance="clear"
							icon={LucideX}
							onClick={() => remove({ id: invite._id })}
						>
							Remove
						</Button>
					</>
				}
			</div>
		</section>
	)
}

function SetCharacterMenu({ player }: { player: PlayerListResult }) {
	const characters = useQuery(api.characters.list)
	const setAssignedCharacterId = useMutation(api.players.setAssignedCharacterId)

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
									setAssignedCharacterId({
										id: player._id,
										assignedCharacterId: character._id,
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
