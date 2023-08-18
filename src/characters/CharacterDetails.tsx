import { api } from "convex/_generated/api"
import { type Id } from "convex/_generated/dataModel"
import { useQuerySuspense } from "~/helpers/useQuerySuspense"

export function CharacterDetails({ characterId }: { characterId: string }) {
	const result = useQuerySuspense(api.characters.get, {
		id: characterId as Id<"characters">,
	})
	return !result.character ? (
		<p>Character not found</p>
	) : (
		<div className="grid gap-2">
			<p className="text-2xl font-light">{result.character.name}</p>
		</div>
	)
}
