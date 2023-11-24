import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "cmdk"
import { LucideX } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { autoRef } from "~/helpers/autoRef.ts"
import { groupBy } from "~/helpers/collections.ts"
import { setRemove } from "~/helpers/set.ts"
import { input } from "~/styles/index.ts"
import { panel } from "~/styles/panel.ts"
import { type SorcerySpell, type SorcerySpellId, sorcerySpells } from "./data"

export const SorcerySpellSelect = autoRef(function SorcerySpellSelect({
	value: selectedSpellIds,
	onChange,
	...props
}: Omit<React.ComponentPropsWithRef<"input">, "value" | "onChange"> & {
	value: ReadonlySet<SorcerySpellId>
	onChange: (value: ReadonlySet<SorcerySpellId>) => void
}) {
	const { selected = [], available = [] } = groupBy(
		Object.entries(sorcerySpells),
		([id]) => (selectedSpellIds.has(id) ? "selected" : "available"),
	)

	return (
		<Command loop label="Spell Search">
			<CommandInput
				className={input()}
				placeholder="Search for spells..."
				{...props}
			/>

			<CommandList
				className={panel(
					"mt-2 max-h-[320px] overflow-y-auto rounded-md border p-1 [&_[cmdk-group]+[cmdk-group]]:mt-2 [&_[cmdk-item]+[cmdk-item]]:mt-1",
				)}
			>
				{selected.length > 0 && (
					<CommandGroup heading={<GroupHeading>Selected</GroupHeading>}>
						{selected.map(([id, spell]) => (
							<SpellSelectItem
								key={id}
								spell={spell}
								icon={<LucideX className="s-5" />}
								className="text-accent-300"
								onSelect={() => {
									onChange(setRemove(selectedSpellIds, id))
								}}
							/>
						))}
					</CommandGroup>
				)}

				{available.length > 0 && (
					<CommandGroup heading={<GroupHeading>Spells</GroupHeading>}>
						<CommandEmpty>No results found.</CommandEmpty>
						{available.map(([id, spell]) => (
							<SpellSelectItem
								key={id}
								spell={spell}
								onSelect={() => {
									onChange(new Set([...selectedSpellIds, id]))
								}}
							/>
						))}
					</CommandGroup>
				)}
			</CommandList>
		</Command>
	)
})

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
