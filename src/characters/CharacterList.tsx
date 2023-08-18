import { api } from "convex/_generated/api"
import { LucideChevronRight } from "lucide-react"
import { Link } from "wouter"
import { useQuerySuspense } from "~/convex/useSuspenseQuery"
import { panel } from "~/styles/panel"

export function CharacterList() {
	const characters = useQuerySuspense(api.characters.list)
	return characters.length === 0 ? (
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
