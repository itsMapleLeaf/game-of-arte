import { DialogTitle } from "@radix-ui/react-dialog"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "cmdk"
import { LucideX } from "lucide-react"
import { useState } from "react"
import ExpandingTextArea from "react-expanding-textarea"
import { twMerge } from "tailwind-merge"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogPanel,
	DialogTrigger,
} from "~/components/Dialog.tsx"
import {
	Field,
	FieldDescription,
	FieldInput,
	FieldLabel,
	FieldLabelText,
} from "~/components/Field.tsx"
import { randomItem } from "~/helpers/index.ts"
import { useOnce } from "~/helpers/useOnce.ts"
import { clearButton, solidButton } from "~/styles/button.ts"
import { input, textArea } from "~/styles/index.ts"
import { panel } from "~/styles/panel.ts"
import {
	type SorcerySpell,
	type SorcerySpellId,
	sorcerySpellIds,
	sorcerySpells,
} from "./sorcerySpells"

export const SorceryDeviceDialogTrigger = DialogTrigger

export function SorceryDeviceDialog({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Dialog>
			{children}
			<DialogContent className="w-full max-w-md">
				<DialogPanel className="flex flex-col gap-3 p-4">
					<DialogTitle className="text-center text-3xl font-light">
						Sorcery Device
					</DialogTitle>
					<SorceryDeviceForm />
				</DialogPanel>
			</DialogContent>
		</Dialog>
	)
}

function SorceryDeviceForm() {
	const placeholder = useOnce(() => randomItem(placeholders))

	const [selectedAffinitySpellIds, setSelectedAffinitySpellIds] = useState(
		new Set<SorcerySpellId>(),
	)

	const addSpellId = (spellId: keyof typeof sorcerySpells) => {
		setSelectedAffinitySpellIds((prev) => new Set(prev).add(spellId))
	}

	const removeSpellId = (spellId: keyof typeof sorcerySpells) => {
		setSelectedAffinitySpellIds((prev) => {
			const next = new Set(prev)
			next.delete(spellId)
			return next
		})
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		// todo
	}

	return (
		<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
			<Field>
				<FieldLabel>Description</FieldLabel>
				<FieldInput asChild>
					<ExpandingTextArea
						className={textArea()}
						placeholder={placeholder}
						required
					/>
				</FieldInput>
			</Field>

			<Field>
				<FieldLabelText>Affinity Spells</FieldLabelText>
				<FieldDescription>
					Select three spells. This device will let you cast those spells more
					often.
				</FieldDescription>
				<SpellSelect
					selectedSpells={selectedAffinitySpellIds}
					onSelect={addSpellId}
					onDeselect={removeSpellId}
				/>
			</Field>

			<div className="flex justify-end gap-2">
				<DialogClose type="button" className={clearButton()}>
					Cancel
				</DialogClose>
				<button type="submit" className={solidButton()}>
					Submit
				</button>
			</div>
		</form>
	)
}

function SpellSelect({
	selectedSpells,
	onSelect,
	onDeselect,
}: {
	selectedSpells: Iterable<keyof typeof sorcerySpells>
	onSelect: (spellId: keyof typeof sorcerySpells) => void
	onDeselect: (spellId: keyof typeof sorcerySpells) => void
}) {
	const selectedSpellSet = new Set(selectedSpells)
	return (
		<Command loop>
			<CommandInput className={input()} placeholder="Search for spells..." />

			<CommandList
				className={panel(
					"mt-2 max-h-[320px] overflow-y-auto rounded-md border p-1 [&_[cmdk-group]+[cmdk-group]]:mt-2 [&_[cmdk-item]+[cmdk-item]]:mt-1",
				)}
			>
				{selectedSpellSet.size > 0 && (
					<CommandGroup
						heading={
							<SpellSelectGroupHeading>Selected</SpellSelectGroupHeading>
						}
					>
						{[...selectedSpells].map((spellId) => (
							<SpellSelectItem
								key={spellId}
								spell={sorcerySpells[spellId]}
								icon={<LucideX className="s-5" />}
								className="text-accent-300"
								onSelect={() => onDeselect(spellId)}
							/>
						))}
					</CommandGroup>
				)}

				<CommandGroup
					heading={<SpellSelectGroupHeading>Spells</SpellSelectGroupHeading>}
				>
					<CommandEmpty>No results found.</CommandEmpty>
					{sorcerySpellIds.map((spellId) =>
						selectedSpellSet.has(spellId) ? null : (
							<SpellSelectItem
								key={spellId}
								spell={sorcerySpells[spellId]}
								onSelect={() => onSelect(spellId)}
							/>
						),
					)}
				</CommandGroup>
			</CommandList>
		</Command>
	)
}

function SpellSelectGroupHeading({ children }: { children: React.ReactNode }) {
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

const placeholders = [
	"A crystalline wand with a core of swirling liquid, constantly changing color with the caster's emotions.",
	"A glove adorned with ethereal feathers that shimmer in moonlight, each feather representing a different school of magic.",
	"A ring crafted from intertwined vines, with a miniature, glowing tree at its center, shedding leaves that turn into spells when cast.",
	"A necklace featuring a tiny hourglass filled with glowing sand; spells are activated by turning the hourglass upside down.",
	"A scepter with a crystal orb at its tip, containing a miniature lightning storm that crackles and dances within.",
	"A mask with shifting, holographic patterns that respond to the wearer's thoughts, activating spells with specific facial expressions.",
	"A lantern with ever-changing, swirling mist inside, casting shadows that morph into spell symbols when illuminated.",
	"A pair of enchanted earrings with miniature floating books that flip open to reveal spell pages when magic is channeled.",
	"A set of enchanted playing cards, where each card displays a different spell sigil that comes to life when drawn and activated.",
	"A quill with ink that glows with different colors, the spells drawn on parchment becoming real when the ink dries.",
	"A cloak adorned with constellations that come alive, rearranging themselves to form magical patterns when spells are cast.",
	"A mirror with a liquid surface that ripples with magical energy, reflecting spell symbols when activated.",
	"A set of runic stones that levitate and arrange themselves into patterns when the caster speaks incantations.",
	"A pair of shoes with soles made of enchanted glass, revealing intricate spell diagrams with each step.",
	"A pocket watch with a face that transforms into a celestial chart, aligning with specific constellations to unlock different spells.",
	"A fan with feathers made of shimmering scales, each scale representing a different elemental affinity and casting spells accordingly.",
	"A set of nested, intricately carved nesting dolls, each layer containing a smaller doll representing a different magical school.",
	"A staff with a crystal orb at its top, containing a swirling galaxy that aligns with different star formations to unleash spells.",
	"A monocle with a lens that reveals hidden magical symbols in the environment, activating spells when focused on specific patterns.",
	"A set of enchanted dice that change color and display different symbols, determining the type of spell cast based on the rolled combination.",
] as const
