import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import {
	LucideEye,
	LucideEyeOff,
	LucideMoreVertical,
	LucidePlus,
	LucideTrash,
	LucideUser,
} from "lucide-react"
import { startTransition } from "react"
import { twMerge } from "tailwind-merge"
import { LoadingSpinner } from "../../components/LoadingPlaceholder.tsx"
import {
	Menu,
	MenuItem,
	MenuPanel,
	MenuTrigger,
} from "../../components/Menu.tsx"
import { tryUntilNonNil } from "../../helpers/tryUntilNonNil.ts"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"
import { useQuerySuspense } from "../../helpers/useQuerySuspense.ts"
import { characterNameInputId } from "./CharacterNameInput.tsx"
import {
	SetCharacterButton,
	useCurrentCharacterId,
	useSetCurrentCharacterId,
} from "./useCurrentCharacter.tsx"

export function CharacterList() {
	const characters = useQuerySuspense(api.characters.list)
	const roles = useQuerySuspense(api.roles.get)
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			{roles.isAdmin && <NewCharacterButton />}
			<div className="min-h-0 flex-1 overflow-y-auto">
				<CharacterListItems
					characters={characters.filter((character) => !character.hidden)}
				/>
				{roles.isAdmin && (
					<section>
						<h2 className="mt-2 px-3 text-sm font-medium uppercase opacity-60">
							Hidden
						</h2>
						<CharacterListItems
							characters={characters.filter((character) => character.hidden)}
						/>
					</section>
				)}
			</div>
		</div>
	)
}

function CharacterListItems({
	characters,
}: {
	characters: Array<Doc<"characters">>
}) {
	const roles = useQuerySuspense(api.roles.get)
	const player = useQuerySuspense(api.players.self)
	const currentCharacterId = useCurrentCharacterId()

	return characters.length === 0 ? (
		<p className="px-3 py-2 opacity-75">No characters found.</p>
	) : (
		<ul>
			{characters
				.toSorted(
					(a, b) =>
						Number(player?.ownedCharacterId === b._id) -
						Number(player?.ownedCharacterId === a._id),
				)
				.map((character) => (
					<li
						key={character._id}
						className="group/character-list-item relative"
					>
						<SetCharacterButton
							characterId={character._id}
							className={twMerge(
								"group flex w-full gap-2 p-2 transition",
								currentCharacterId === character._id
									? "bg-base-800 opacity-100"
									: "opacity-60 hover:opacity-100",
								player?.ownedCharacterId === character._id && "text-accent-300",
							)}
						>
							<LucideUser className="group-data-[pending]:hidden" />
							<LoadingSpinner className="hidden group-data-[pending]:block" />
							<div className="min-w-0 flex-1">{character.name}</div>
						</SetCharacterButton>
						{roles.isAdmin && (
							<CharacterMenu character={character}>
								<button
									type="button"
									className="absolute inset-y-0 right-0 flex items-center p-2 opacity-0 transition hover:!opacity-100 group-hover/character-list-item:opacity-50"
								>
									<LucideMoreVertical className="s-5" />
								</button>
							</CharacterMenu>
						)}
					</li>
				))}
		</ul>
	)
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
			{character.hidden ? <LucideEye /> : <LucideEyeOff />}
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
	const setCurrentCharacterId = useSetCurrentCharacterId()

	const [handleClick, state] = useAsyncCallback(
		useMutation(api.characters.create),
		{
			async onSuccess(result) {
				startTransition(() => {
					setCurrentCharacterId(result._id)
				})
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
			{state.isLoading ? <LoadingSpinner /> : <LucidePlus />} New Character
		</button>
	)
}
