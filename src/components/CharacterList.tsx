import { api } from "convex/_generated/api"
import { type Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import {
	LucideEye,
	LucideEyeOff,
	LucideMoreVertical,
	LucidePlus,
	LucideTrash,
	LucideUser,
} from "lucide-react"
import { startTransition, useTransition } from "react"
import { useSpinDelay } from "spin-delay"
import { useAppParams } from "../helpers/useAppParams.ts"
import { useAsyncCallback } from "../helpers/useAsyncCallback.ts"
import { useQuerySuspense } from "../helpers/useQuerySuspense.ts"
import { LoadingSpinner } from "./LoadingPlaceholder.tsx"
import { Menu, MenuItem, MenuPanel, MenuTrigger } from "./Menu.tsx"

export function CharacterList() {
	const characters = useQuerySuspense(api.characters.list)
	const roles = useQuerySuspense(api.roles.get)
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			<NewCharacterButton />
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
	return characters.length === 0 ? (
		<p className="px-3 py-2 opacity-75">No characters found.</p>
	) : (
		<ul>
			{characters
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((character) => (
					<li key={character._id} className="group relative">
						<CharacterLink character={character} />
						{roles.isAdmin && (
							<CharacterMenu character={character}>
								<button className="absolute inset-y-0 right-0 flex items-center p-2 opacity-0 transition hover:!opacity-100 group-hover:opacity-50">
									<LucideMoreVertical className="s-5" />
								</button>
							</CharacterMenu>
						)}
					</li>
				))}
		</ul>
	)
}

function CharacterLink({ character }: { character: Doc<"characters"> }) {
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
