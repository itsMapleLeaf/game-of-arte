import { Link } from "@remix-run/react"
import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel.js"
import { useMutation, useQuery } from "convex/react"
import {
	LucideEye,
	LucideEyeOff,
	LucideMoreVertical,
	LucidePlus,
	LucideTrash,
	LucideUser,
} from "lucide-react"
import { twMerge } from "tailwind-merge"
import { tryUntilNonNil } from "~/helpers/async.ts"
import { Collapse, CollapseButton, CollapseContent } from "~/ui/Collapse.tsx"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"
import {
	LoadingPlaceholder,
	LoadingSpinner,
} from "../../ui/LoadingPlaceholder.tsx"
import { Menu, MenuItem, MenuPanel, MenuTrigger } from "../../ui/Menu.tsx"
import { AdminRoleGuard } from "../auth/AdminRoleGuard.tsx"
import { characterNameInputId } from "./CharacterDetails.tsx"
import { useCharacterNavigation } from "./navigation.ts"

export function CharacterList() {
	const characters = useQuery(api.characters.list)
	if (!characters) {
		return <LoadingPlaceholder />
	}
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			<AdminRoleGuard>
				<NewCharacterButton />
			</AdminRoleGuard>
			<div className="min-h-0 flex-1 overflow-y-auto">
				<CharacterListItems
					characters={characters.filter((character) => !character.hidden) ?? []}
				/>
				<AdminRoleGuard>
					<Collapse persistenceKey="characterListHidden">
						<CollapseButton className="px-3 py-2 text-sm font-medium uppercase opacity-75">
							Hidden
						</CollapseButton>
						<CollapseContent>
							<CharacterListItems
								characters={
									characters.filter((character) => character.hidden) ?? []
								}
							/>
						</CollapseContent>
					</Collapse>
				</AdminRoleGuard>
			</div>
		</div>
	)
}

function CharacterListItems({
	characters,
}: {
	characters: Array<Doc<"characters">>
}) {
	const assignedCharacterId = useQuery(api.players.getAssignedCharacterId)
	const characterNavigation = useCharacterNavigation()

	return characters.length === 0 ?
			<p className="px-3 py-2 opacity-75">No characters found.</p>
		:	<ul>
				{characters
					.toSorted(
						(a, b) =>
							Number(assignedCharacterId === b._id) -
							Number(assignedCharacterId === a._id),
					)
					.map((character) => (
						<li
							key={character._id}
							className="group/character-list-item relative"
						>
							<Link
								to={characterNavigation.getCharacterLink(character._id)}
								prefetch="intent"
								className={twMerge(
									"group flex w-full gap-2 p-2 transition",
									characterNavigation.characterId === character._id ?
										"bg-base-800 opacity-100"
									:	"opacity-60 hover:opacity-100",
									assignedCharacterId === character._id && "text-accent-300",
								)}
							>
								<LucideUser className="group-data-[pending]:hidden" />
								<LoadingSpinner className="hidden group-data-[pending]:block" />
								<div className="min-w-0 flex-1">{character.name}</div>
							</Link>

							<AdminRoleGuard>
								<CharacterMenu character={character}>
									<button
										type="button"
										className="absolute inset-y-0 right-0 flex items-center p-2 opacity-0 transition hover:!opacity-100 group-hover/character-list-item:opacity-50"
									>
										<LucideMoreVertical className="s-5" />
									</button>
								</CharacterMenu>
							</AdminRoleGuard>
						</li>
					))}
			</ul>
}

function CharacterMenu({
	character,
	children,
}: {
	character: Doc<"characters">
	children: React.ReactElement
}) {
	return (
		<Menu>
			<MenuTrigger asChild>{children}</MenuTrigger>
			<MenuPanel side="right" align="center">
				<ToggleHiddenItem character={character} />
				<DeleteItem character={character} />
			</MenuPanel>
		</Menu>
	)
}

function ToggleHiddenItem({ character }: { character: Doc<"characters"> }) {
	const update = useMutation(api.characters.update)
	return (
		<MenuItem
			onClick={() => {
				void update({ id: character._id, hidden: !character.hidden })
			}}
		>
			{character.hidden ?
				<LucideEye />
			:	<LucideEyeOff />}
			{character.hidden ? "Show" : "Hide"}
		</MenuItem>
	)
}

function DeleteItem({ character }: { character: Doc<"characters"> }) {
	const remove = useMutation(api.characters.remove)
	return (
		<MenuItem
			onClick={() => {
				void remove({ id: character._id })
			}}
		>
			<LucideTrash /> Delete
		</MenuItem>
	)
}

function NewCharacterButton() {
	const navigation = useCharacterNavigation()

	const [handleClick, state] = useAsyncCallback(
		useMutation(api.characters.create),
		{
			async onSuccess(result) {
				navigation.setCharacterId(result._id)
				const nameInput = await tryUntilNonNil(() =>
					document.getElementById(characterNameInputId),
				)
				nameInput?.focus()
			},
		},
	)

	return (
		<button
			type="button"
			className="flex gap-2 p-2 opacity-75 transition hover:bg-base-800 hover:opacity-100 disabled:opacity-50"
			onClick={() => {
				handleClick({})
			}}
			disabled={state.isLoading}
		>
			{state.isLoading ?
				<LoadingSpinner />
			:	<LucidePlus />}{" "}
			New Character
		</button>
	)
}
