import {
	Composite,
	CompositeItem,
	CompositeProvider,
	CompositeRow,
} from "@ariakit/react"
import type { Doc } from "convex/_generated/dataModel.js"
import { LucideCheck, LucideInfo, LucideSparkles } from "lucide-react"
import { matchSorter } from "match-sorter"
import { useState } from "react"
import { autoRef } from "~/helpers/autoRef.tsx"
import { plural } from "~/helpers/index.ts"
import { setRemove } from "~/helpers/set.ts"
import { clearButton, outlineButton, solidButton } from "~/styles/button.ts"
import { checkbox, input } from "~/styles/index.ts"
import { SorcerySpellDetailsButton } from "./SorcerySpellDetailsButton"
import { type SorcerySpellId, sorcerySpells } from "./spells"

export const SorcerySpellSelect = autoRef(function SorcerySpellSelect({
	sorceryDevice,
	count,
	initialSpellIds,
	onSubmit,
}: {
	sorceryDevice: NonNullable<Doc<"characters">["sorceryDevice"]>
	count: number
	initialSpellIds?: Iterable<SorcerySpellId>
	onSubmit: (spellIds: ReadonlySet<SorcerySpellId>) => void
}) {
	const [selected, setSelected] = useState<ReadonlySet<SorcerySpellId>>(
		() => new Set(initialSpellIds),
	)
	const [search, setSearch] = useState("")
	const affinitySpellIds = new Set(
		Object.values(sorceryDevice.affinities ?? {}),
	)

	const matchedSpells = matchSorter(Object.entries(sorcerySpells), search, {
		keys: ["1.name", "1.description", "1.amplifyDescription", "1.caveats"],
	})

	return (
		<div className="flex flex-col gap-3 p-3">
			<input
				className={input()}
				placeholder="Search for spells..."
				value={search}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					setSearch(event.target.value)
				}}
			/>

			<CompositeProvider focusLoop="vertical">
				<Composite
					render={
						<div className="h-[calc(100dvh-32rem)] space-y-2 overflow-y-auto" />
					}
				>
					{matchedSpells.map(([id, spell]) => (
						<CompositeRow key={id} className="flex">
							<label
								className={outlineButton(
									"flex-1 cursor-pointer justify-start gap-2 ring-inset ring-accent-400 [&:has(:checked)]:text-accent-400 [&:has(:focus-visible)]:ring-2",
								)}
							>
								<CompositeItem
									render={
										<input
											type={count === 1 ? "radio" : "checkbox"}
											className={checkbox("focus-visible:ring-0")}
											checked={selected.has(id)}
											onChange={(event) => {
												setSelected((selected) =>
													count === 1 ? new Set([id])
													: event.target.checked ? new Set([...selected, id])
													: setRemove(selected, id),
												)
											}}
										/>
									}
								/>
								{spell.name}
								{affinitySpellIds.has(id) && (
									<LucideSparkles aria-label="Affinity spell" />
								)}
							</label>

							<SorcerySpellDetailsButton spell={spell} asChild>
								<CompositeItem
									type="button"
									className={clearButton(
										"aspect-square opacity-50 hover:bg-transparent hover:opacity-100",
									)}
								>
									<LucideInfo aria-hidden />
									<span className="sr-only">Learn more about {spell.name}</span>
								</CompositeItem>
							</SorcerySpellDetailsButton>
						</CompositeRow>
					))}
				</Composite>
			</CompositeProvider>

			<div className="flex h-10 items-end">
				{selected.size === count ?
					<button
						type="button"
						className={solidButton("w-full")}
						onClick={() => {
							onSubmit(selected)
						}}
					>
						<LucideCheck /> Confirm
					</button>
				: count === 1 ?
					<p>Choose a spell to continue.</p>
				: selected.size > count ?
					<p>Remove {plural(selected.size - count, "spell")} to continue.</p>
				:	<p>
						Choose {plural(count - selected.size, "more spell")} to continue.
					</p>
				}
			</div>
		</div>
	)
})
