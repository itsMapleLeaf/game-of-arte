import { api } from "convex/_generated/api.js"
import { useMutation } from "convex/react"
import { LucideSparkles, LucideX } from "lucide-react"
import { matchSorter } from "match-sorter"
import { useState } from "react"
import { autoRef } from "~/helpers/autoRef.tsx"
import { groupBy } from "~/helpers/collections.ts"
import { plural } from "~/helpers/string.ts"
import { Button } from "~/ui/Button.tsx"
import { Collapse, CollapseButton, CollapseContent } from "~/ui/Collapse.tsx"
import { ConfirmDialog } from "~/ui/ConfirmDialog.tsx"
import { ScrollArea } from "~/ui/ScrollArea.tsx"
import { SrOnly } from "~/ui/SrOnly.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/ui/Tooltip.tsx"
import { input } from "~/ui/styles.ts"
import { CharacterContext } from "../characters/CharacterContext.tsx"
import { getAttributeById } from "../characters/attributes.ts"
import { getCharacterAttributeValue } from "../characters/data.ts"
import { type SorcerySpell, sorcerySpells } from "./spells"

export const SorcerySpellSelect = autoRef(function SorcerySpellSelect({
	onSelect,
}: {
	onSelect: (spell: SorcerySpell) => void
}) {
	const character = CharacterContext.useValue()

	const [search, setSearch] = useState("")

	const matchedSpells = matchSorter(
		[
			...Object.entries(sorcerySpells),
			...(character.freeformSpells?.map(
				(spell) => [spell.id, spell] as const,
			) ?? []),
		],
		search,
		{
			keys: [
				"1.name",
				"1.description",
				"1.amplifyDescription",
				"1.caveats",
				"1.attributeId",
			],
		},
	)

	const spellsByAttribute = groupBy(matchedSpells, ([, spell]) =>
		// this will probably crash
		getAttributeById(spell.attributeId),
	)

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

			<ScrollArea className="-mr-3 h-[calc(100dvh-20rem)] pr-3">
				{[...spellsByAttribute.entries()]
					.sort(([a], [b]) => a.name.localeCompare(b.name))
					.map(([attribute, spells]) => (
						<div key={attribute.id} className="pb-3">
							<AttributeSectionCollapse attribute={attribute}>
								{spells.map(([id, spell]) => (
									<SpellButton
										key={id}
										spell={{ ...spell, id }}
										onClick={() => onSelect(spell)}
									/>
								))}
							</AttributeSectionCollapse>
						</div>
					))}
			</ScrollArea>
		</div>
	)
})

function AttributeSectionCollapse({
	attribute,
	children,
}: {
	attribute: ReturnType<typeof getAttributeById>
	children: React.ReactNode
}) {
	const character = CharacterContext.useValue()
	return (
		<Collapse persistenceKey={`spellbook-${attribute.id}`} defaultOpen>
			<CollapseButton className="py-2 text-2xl font-light">
				{attribute.name} ({getCharacterAttributeValue(character, attribute.id)})
			</CollapseButton>
			<CollapseContent className="flex flex-col space-y-2">
				{children}
			</CollapseContent>
		</Collapse>
	)
}

function SpellButton({
	spell,
	onClick,
}: {
	spell: SorcerySpell & { id: string }
	onClick: () => void
}) {
	const character = CharacterContext.useValue()
	const removeFreeformSpell = useMutation(api.characters.removeFreeformSpell)
	const isFreeform = sorcerySpells[spell.id] == null
	return (
		<div className="relative">
			<Button
				appearance="outline"
				onClick={onClick}
				className="w-full flex-col items-start gap-3 py-3"
			>
				<h4 className="text-xl font-light">
					{isFreeform ?
						<Tooltip>
							<TooltipTrigger asChild>
								<LucideSparkles className="inline" />
							</TooltipTrigger>
							<TooltipContent>Freeform spell</TooltipContent>
						</Tooltip>
					:	null}{" "}
					{spell.name}
				</h4>
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
						{spell.cost.mentalStress ?
							<span>, {spell.cost.mentalStress} stress</span>
						:	null}
						{spell.castingTime?.turns ?
							<span>, {plural(spell.castingTime.turns, "turn")}</span>
						:	null}
					</p>
				</section>
			</Button>
			{isFreeform && (
				<ConfirmDialog
					title="Remove spell"
					description="Are you sure you want to remove this spell from your spellbook?"
					confirmText="Remove"
					onConfirm={() =>
						removeFreeformSpell({ id: character._id, spellId: spell.id })
					}
				>
					<Button
						appearance="faded"
						className="absolute right-0 top-0"
						square
						icon={LucideX}
						iconPosition="end"
					>
						<SrOnly>Remove</SrOnly>
					</Button>
				</ConfirmDialog>
			)}
		</div>
	)
}
