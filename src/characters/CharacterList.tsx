import { api } from "convex/_generated/api"
import { useQuery } from "convex/react"
import { LucideChevronRight } from "lucide-react"
import { Link } from "wouter"
import { panel } from "~/styles/panel"

export function CharacterList() {
	const characters = useQuery(api.characters.list)
	return characters === undefined ? (
		<p>Loading...</p>
	) : characters.length === 0 ? (
		<p>No characters found.</p>
	) : (
		<ul className="grid gap-2">
			{characters.map((character) => (
				<li key={character._id}>
					<Link
						href={`/characters/${character._id}`}
						className={panel(
							"flex items-center justify-between rounded-md border p-3 text-xl font-light leading-tight shadow",
						)}
					>
						{character.name}
						<LucideChevronRight className="-mr-2" />
					</Link>
				</li>
			))}
		</ul>
	)
}
