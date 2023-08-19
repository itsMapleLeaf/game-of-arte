import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"
import { LucidePlus, LucideUser } from "lucide-react"
import { Link, useLocation } from "wouter"
import { useAsyncCallback } from "../helpers/useAsyncCallback"
import { useQuerySuspense } from "../helpers/useQuerySuspense"
import { LoadingSpinner } from "./LoadingPlaceholder"

export function CharacterList() {
	const characters = useQuerySuspense(api.characters.list)
	return characters.length === 0 ? (
		<p>No characters found.</p>
	) : (
		<ul className="flex flex-col">
			{characters.map((character) => (
				<li key={character._id}>
					<Link
						href={`/characters/${character._id}`}
						className="flex gap-2 p-2 opacity-75 transition hover:bg-base-800 hover:opacity-100"
					>
						<LucideUser />
						{character.name}
					</Link>
				</li>
			))}
			<NewCharacterButton />
		</ul>
	)
}

function NewCharacterButton() {
	const [, setLocation] = useLocation()

	const [handleClick, state] = useAsyncCallback(
		useMutation(api.characters.create),
		{
			onSuccess(result) {
				setLocation(`/characters/${result.id}`)
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
