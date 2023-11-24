import { CommandItem } from "cmdk"
import { LucideCheck, LucideCheckCircle2 } from "lucide-react"
import { matchSorter } from "match-sorter"
import { useRef, useState } from "react"
import { ListBox, ListBoxItem } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { autoRef } from "~/helpers/autoRef.ts"
import { mapIterable } from "~/helpers/iterable.ts"
import { clearButton, solidButton } from "~/styles/button.ts"
import { input } from "~/styles/index.ts"
import { type SorcerySpell, type SorcerySpellId, sorcerySpells } from "./data"

export const SorcerySpellSelect = autoRef(function SorcerySpellSelect({
	count,
	initialSpellIds,
	onSubmit,
}: {
	count: number
	initialSpellIds: Iterable<SorcerySpellId>
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
		<div className="grid gap-3 p-3">
			<input
				className={input()}
				placeholder="Search for spells..."
				value={search}
				onChange={(event) => {
					setSearch(event.target.value)
				}}
				ref={inputRef}
			/>

			<ListBox
				className="children:shrink-0 flex h-[calc(100dvh-32rem)] flex-col gap-2 overflow-y-auto"
				selectionMode="multiple"
				selectedKeys={selected}
				onSelectionChange={(selection) => {
					if (selection !== "all") {
						setSelected(new Set(mapIterable(selection, String)))
					}
				}}
			>
				{matchedSpells.map(([id, spell]) => (
					<ListBoxItem
						key={id}
						id={id}
						className={clearButton(
							"flex cursor-pointer items-center gap-2 border border-base-800 ring-inset ring-accent-400 hover:bg-base-900 focus-visible:ring-0 aria-selected:text-accent-400 data-[focus-visible]:ring-2",
						)}
					>
						<div className="flex-1">{spell.name}</div>
						{selected.has(id) && <LucideCheckCircle2 />}
					</ListBoxItem>
				))}
			</ListBox>

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
					<p>
						Remove {selected.size - count}{" "}
						{plural(selected.size - count, "spell")} to continue.
					</p>
				:	<p>
						Choose {count - selected.size} more{" "}
						{plural(count - selected.size, "spell")} to continue.
					</p>
				}
			</div>
		</div>
	)
})

function plural(count: number, word: string, pluralWord = `${word}s`) {
	return count === 1 ? word : pluralWord
}

function GroupHeading({ children }: { children: React.ReactNode }) {
	return (
		<span className="px-1.5 text-sm font-medium uppercase tracking-wide opacity-60">
			{children}
		</span>
	)
}

function SpellSelectItem({
	spell,
	icon,
	className,
	onSelect,
}: {
	spell: SorcerySpell
	icon?: React.ReactNode
	className?: string
	onSelect: () => void
}) {
	return (
		<CommandItem
			className={twMerge(
				"group flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 transition data-[selected]:bg-white/10",
				className,
			)}
			onSelect={onSelect}
		>
			<div className="flex-1">
				<h3>{spell.name}</h3>
				<p className="text-sm opacity-75">{spell.description}</p>
			</div>
			<div className="opacity-0 transition-opacity group-data-[selected]:opacity-50">
				{icon}
			</div>
		</CommandItem>
	)
}
