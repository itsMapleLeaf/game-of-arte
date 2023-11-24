import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { LucideSparkles, LucideX } from "lucide-react"
import { useState } from "react"
import ExpandingTextArea from "react-expanding-textarea"
import { ConfirmDialog } from "~/components/ConfirmDialog.tsx"
import {
	Dialog,
	DialogTrigger,
	SimpleDialogContent,
} from "~/components/Dialog.tsx"
import {
	Field,
	FieldDescription,
	FieldInput,
	FieldLabel,
	FieldLabelText,
} from "~/components/Field.tsx"
import { randomItem } from "~/helpers/index.ts"
import type { NonEmptyArray } from "~/helpers/types.ts"
import { solidButton } from "~/styles/button.ts"
import { textArea } from "~/styles/index.ts"
import { panel } from "~/styles/panel.ts"
import { SorcerySpellSelect } from "./SorcerySpellSelect.tsx"
import { sorcerySpells } from "./data.ts"

export function SorceryDeviceEditor({
	character,
	sorceryDevice,
}: {
	character: Doc<"characters">
	sorceryDevice: NonNullable<Doc<"characters">["sorceryDevice"]>
}) {
	const [descriptionPlaceholder] = useState(() =>
		randomItem(descriptionPlaceholders),
	)

	const setSorceryDevice = useMutation(
		api.characters.setSorceryDevice,
	).withOptimisticUpdate((store, args) => {
		const character = store.getQuery(api.characters.get, { id: args.id })
		if (!character) return

		store.setQuery(
			api.characters.get,
			{ id: args.id },
			{
				...character,
				sorceryDevice: args.sorceryDevice ?? undefined,
			},
		)
	})

	const updateSorceryDevice = (
		data: Partial<Doc<"characters">["sorceryDevice"]>,
	) => {
		setSorceryDevice({
			id: character._id,
			sorceryDevice: {
				...sorceryDevice,
				...data,
			},
		})
	}

	return (
		<>
			<Field>
				<FieldLabel>Sorcery Device</FieldLabel>
				<FieldDescription>Describe your sorcery device.</FieldDescription>
				<FieldInput asChild>
					<ExpandingTextArea
						className={textArea()}
						placeholder={descriptionPlaceholder}
						value={sorceryDevice.description}
						onChange={(event) => {
							updateSorceryDevice({ description: event.target.value })
						}}
					/>
				</FieldInput>
			</Field>

			{sorceryDevice.affinities && (
				<Field>
					<FieldLabelText>Affinity Spells</FieldLabelText>
					<FieldDescription>
						You can cast affinity spells more often.
					</FieldDescription>
					<FieldInput asChild>
						<ul className="flex flex-wrap gap-2">
							{Object.values(sorceryDevice.affinities)
								.flatMap((spellId) => {
									const spell = sorcerySpells[spellId]
									return spell ? [[spellId, spell] as const] : []
								})
								.map(([id, spell]) => (
									<li key={id} className={panel("rounded border px-2 py-1")}>
										{spell.name}
									</li>
								))}
						</ul>
					</FieldInput>
				</Field>
			)}

			<ChooseAffinitySpellsButton
				sorceryDevice={sorceryDevice}
				onSubmit={(affinities) => {
					updateSorceryDevice({ affinities })
				}}
			/>

			<ConfirmDialog
				title="Remove Sorcery Device"
				description="Are you sure you want to remove this character's sorcery device?"
				confirmText="Remove"
				onConfirm={() => {
					setSorceryDevice({
						id: character._id,
						sorceryDevice: null,
					})
				}}
			>
				<button type="button" className={solidButton()}>
					<LucideX /> Remove Sorcery Device
				</button>
			</ConfirmDialog>
		</>
	)
}

function ChooseAffinitySpellsButton({
	sorceryDevice,
	onSubmit,
}: {
	sorceryDevice: NonNullable<Doc<"characters">["sorceryDevice"]>
	onSubmit: (
		affinities: NonNullable<Doc<"characters">["sorceryDevice"]>["affinities"],
	) => void
}) {
	const [open, setOpen] = useState(false)
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger type="button" className={solidButton()}>
				<LucideSparkles /> Choose Affinity Spells
			</DialogTrigger>
			<SimpleDialogContent title="Choose Affinity Spells">
				<SorcerySpellSelect
					count={3}
					initialSpellIds={Object.values(sorceryDevice.affinities ?? {})}
					onSubmit={([first, second, third]) => {
						if (first && second && third) {
							onSubmit({ first, second, third })
							setOpen(false)
						}
					}}
				/>
			</SimpleDialogContent>
		</Dialog>
	)
}

const descriptionPlaceholders: NonEmptyArray<string> = [
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
]
