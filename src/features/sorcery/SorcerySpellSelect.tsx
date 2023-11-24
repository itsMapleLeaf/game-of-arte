import {
	Composite,
	CompositeItem,
	CompositeProvider,
	CompositeRow,
} from "@ariakit/react"
import { LucideCheck, LucideInfo } from "lucide-react"
import { matchSorter } from "match-sorter"
import { useRef, useState } from "react"
import { autoRef } from "~/helpers/autoRef.ts"
import { plural } from "~/helpers/index.ts"
import { setRemove } from "~/helpers/set.ts"
import { clearButton, outlineButton, solidButton } from "~/styles/button.ts"
import { input } from "~/styles/index.ts"
import { SorcerySpellDetailsButton } from "./SorcerySpellDetailsButton"
import { type SorcerySpellId, sorcerySpells } from "./data"

export const SorcerySpellSelect = autoRef(function SorcerySpellSelect({
	count,
	initialSpellIds,
	onSubmit,
}: {
	count: number
	initialSpellIds?: Iterable<SorcerySpellId>
	onSubmit: (spellIds: ReadonlySet<SorcerySpellId>) => void
}) {
	const [selected, setSelected] = useState<ReadonlySet<SorcerySpellId>>(
		() => new Set(initialSpellIds),
	)
	const [search, setSearch] = useState("")
	const buttonRef = useRef<HTMLButtonElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

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
				ref={inputRef}
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
									"flex-1 cursor-pointer gap-2 ring-inset ring-accent-400 [&:has(:checked)]:text-accent-400 [&:has(:focus-visible)]:ring-2",
								)}
							>
								<CompositeItem
									render={
										<input
											type={count === 1 ? "radio" : "checkbox"}
											className="accent-accent-400 s-4 focus-visible:ring-0"
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
								<div className="flex-1">{spell.name}</div>
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
						ref={buttonRef}
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
