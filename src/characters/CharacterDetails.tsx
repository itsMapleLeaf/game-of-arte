import { api } from "convex/_generated/api"
import { type Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/react"

export function CharacterDetails({ characterId }: { characterId: string }) {
	const data = useQuery(api.characters.get, {
		id: characterId as Id<"characters">,
	})
	return data === undefined ? (
		<p>Loading...</p>
	) : !data.character ? (
		<p>Character not found</p>
	) : (
		<div className="grid gap-2">
			<p className="text-2xl font-light">{data.character.name}</p>
		</div>
	)
}
