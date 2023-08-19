import { api } from "convex/_generated/api"
import { LucideUser } from "lucide-react"
import { Link } from "wouter"
import { useQuerySuspense } from "../helpers/useQuerySuspense"

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
		</ul>
	)
}
