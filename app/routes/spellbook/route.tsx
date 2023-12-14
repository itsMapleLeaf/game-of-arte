import { type LoaderFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { api } from "convex/_generated/api.js"
import { LucideSparkles } from "lucide-react"
import type { Key, ReactNode } from "react"
import { getAttributeById } from "~/features/characters/attributes.ts"
import { sorcerySpells } from "~/features/sorcery/spells.ts"
import { createConvexClient } from "~/helpers/convex.server"
import { pick } from "~/helpers/object.ts"
import { plural } from "~/helpers/string.ts"
import { container } from "~/styles/container.ts"
import { panel } from "~/styles/panel.ts"

export async function loader(args: LoaderFunctionArgs) {
	const convex = await createConvexClient(args)
	const character = await convex.query(api.characters.getOwned)
	return json({
		character: character && pick(character, ["freeformSpells"]),
	})
}

export default function SpellbookPage() {
	const { character } = useLoaderData<typeof loader>()

	type Row = {
		id: Key
		name: ReactNode
		attribute: ReactNode
		cost: ReactNode
		castingTime: ReactNode
		description: ReactNode
		amplifiedDescription: ReactNode
		drawbacks: string[]
		freeform?: boolean
	}

	const rows: Row[] = [
		...Object.entries(sorcerySpells).map(([id, spell]) => ({
			id,
			name: spell.name,
			attribute: getAttributeById(spell.attributeId).name,
			cost: `${spell.cost.mana} mana${
				spell.cost.mentalStress ? `, ${spell.cost.mentalStress} stress` : ""
			}`,
			castingTime:
				spell.castingTime?.turns ?
					plural(spell.castingTime.turns, `turn`)
				:	"Immediate",
			description: spell.description,
			amplifiedDescription: spell.amplifiedDescription,
			drawbacks: spell.drawbacks ?? [],
		})),
		...(character?.freeformSpells?.map((spell) => ({
			id: spell.id,
			name: spell.name,
			attribute: getAttributeById(spell.attributeId).name,
			cost: `${spell.cost.mana} mana${
				spell.cost.mentalStress ? `, ${spell.cost.mentalStress} stress` : ""
			}`,
			castingTime:
				spell.castingTime?.turns ?
					plural(spell.castingTime.turns, `turn`)
				:	"Immediate",
			description: spell.description,
			amplifiedDescription: spell.amplifiedDescription,
			drawbacks: spell.drawbacks ?? [],
			freeform: true,
		})) ?? []),
	]
		.sort((a, b) =>
			a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()),
		)
		.sort((a, b) => a.attribute.localeCompare(b.attribute.toLocaleLowerCase()))

	return (
		<main className={container("max-w-screen-xl py-4")}>
			<table
				className={panel(
					"grid grid-cols-[auto,auto,auto,auto,2fr,1.5fr,1.5fr] gap-2 rounded-md bg-base-950 [&_:is(th,td)]:px-3 [&_:is(th,td)]:py-2 [&_:is(th,td)]:text-start [&_th]:font-medium",
				)}
			>
				<thead className="contents">
					<tr className="col-span-full grid grid-cols-[subgrid]">
						<th>Name</th>
						<th>Attribute</th>
						<th>Cost</th>
						<th>Casting Time</th>
						<th>Description</th>
						<th>Amplified</th>
						<th>Drawbacks</th>
					</tr>
				</thead>
				<tbody className="contents">
					{rows.map((row) => (
						<tr
							key={row.id}
							className={panel(
								"col-span-full grid grid-cols-[subgrid] rounded border border-base-800 bg-base-900",
							)}
						>
							<td>
								{row.name}{" "}
								{row.freeform && <LucideSparkles className="inline s-[1em]" />}
							</td>
							<td>{row.attribute}</td>
							<td>{row.cost}</td>
							<td>{row.castingTime}</td>
							<td>{row.description}</td>
							<td>{row.amplifiedDescription}</td>
							<td>
								{row.drawbacks && (
									<ul className="list-disc">
										{row.drawbacks.map((drawback) => (
											<li key={drawback}>{drawback}</li>
										))}
									</ul>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	)
}
