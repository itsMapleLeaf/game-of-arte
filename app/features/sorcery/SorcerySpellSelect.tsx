import { Composite, CompositeItem, CompositeProvider } from "@ariakit/react"
import { matchSorter } from "match-sorter"
import { useState } from "react"
import { Button } from "~/components/Button.tsx"
import { CollapsePersisted, CollapseSummary } from "~/components/Collapse.tsx"
import { ScrollArea } from "~/components/ScrollArea.tsx"
import { autoRef } from "~/helpers/autoRef.tsx"
import { groupBy } from "~/helpers/collections.ts"
import { plural } from "~/helpers/string.ts"
import { input } from "~/styles/index.ts"
import { CharacterContext } from "../characters/CharacterContext.tsx"
import { getAttributeById } from "../characters/attributes.ts"
import { getCharacterAttributeValue } from "../characters/data.ts"
import { type SorcerySpellId, sorcerySpells } from "./spells"

export const SorcerySpellSelect = autoRef(function SorcerySpellSelect({
	onSelect,
}: {
	onSelect: (spellId: SorcerySpellId) => void
}) {
	const [search, setSearch] = useState("")

	const matchedSpells = matchSorter(Object.entries(sorcerySpells), search, {
		keys: [
			"1.name",
			"1.description",
			"1.amplifyDescription",
			"1.caveats",
			"1.attributeId",
		],
	})

	const spellsByAttribute = groupBy(matchedSpells, ([, spell]) =>
		getAttributeById(spell.attributeId),
	)

	const character = CharacterContext.useValue()

	return (
		<div className="flex flex-col gap-3 p-3">
			<input
				className={input()}
				placeholder="Search for spells..."
				value={search}
				onChange={(event) => {
					setSearch(event.target.value)
				}}
			/>

			<CompositeProvider>
				<Composite className="h-[calc(100dvh-20rem)]">
					<ScrollArea className="-mr-3 h-full pr-3">
						{[...spellsByAttribute.entries()]
							.sort(([a], [b]) => a.name.localeCompare(b.name))
							.map(([attribute, spells]) => (
								<CollapsePersisted
									key={attribute.id}
									persistenceKey={`spellbook-${attribute.id}`}
									defaultOpen
									className="pb-3"
								>
									<CollapseSummary className="py-2 text-3xl font-light">
										{attribute.name} (
										{getCharacterAttributeValue(character, attribute.id)})
									</CollapseSummary>

									<div className="flex flex-col space-y-2">
										{spells.map(([id, spell]) => (
											<Button
												key={id}
												appearance="outline"
												onClick={() => onSelect(id)}
												className="flex-col items-start gap-3 py-3"
												asChild
											>
												<CompositeItem>
													<h4 className="text-xl font-light">{spell.name}</h4>
													<p>{spell.description}</p>
													<section>
														<h5 className="text-sm/relaxed font-medium uppercase tracking-wide opacity-75">
															Amplify
														</h5>
														<p>{spell.amplifiedDescription}</p>
													</section>
													<section>
														<h5 className="text-sm/relaxed font-medium uppercase tracking-wide opacity-75">
															Cost
														</h5>
														<p>
															<span>{spell.cost.mana} mana</span>
															{spell.cost.mentalStress && (
																<span>, {spell.cost.mentalStress} stress</span>
															)}
															{spell.castingTime && (
																<span>
																	, {plural(spell.castingTime.turns, "turn")}
																</span>
															)}
														</p>
													</section>
												</CompositeItem>
											</Button>
										))}
									</div>
								</CollapsePersisted>
							))}
					</ScrollArea>
				</Composite>
			</CompositeProvider>
		</div>
	)
})
