import type { Doc } from "convex/_generated/dataModel"
import { LucideInfo } from "lucide-react"
import { useState } from "react"
import ExpandingTextArea from "react-expanding-textarea"
import {
	Field,
	FieldDescription,
	FieldInput,
	FieldLabel,
	FieldLabelText,
} from "~/components/Field.tsx"
import { randomItem } from "~/helpers/index.ts"
import type { NonEmptyArray } from "~/helpers/types.ts"
import { outlineButton } from "~/styles/button.ts"
import { textArea } from "~/styles/index.ts"
import { SorcerySpellDetailsButton } from "./SorcerySpellDetailsButton.tsx"
import { sorcerySpells } from "./spells.ts"
import { useSetSorceryDeviceMutation } from "./useSetSorceryDeviceMutation.tsx"

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

	const setSorceryDevice = useSetSorceryDeviceMutation()

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
						className={textArea("max-h-32")}
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
						You can cast affinity spells more reliably.
					</FieldDescription>
					<FieldInput asChild>
						<ul className="flex flex-wrap gap-2">
							{Object.values(sorceryDevice.affinities)
								.flatMap((spellId) => {
									const spell = sorcerySpells[spellId]
									return spell ? [[spellId, spell] as const] : []
								})
								.map(([id, spell]) => (
									<li key={id} className="contents">
										<SorcerySpellDetailsButton
											spell={spell}
											className={outlineButton()}
										>
											<LucideInfo className="s-4" /> {spell.name}
										</SorcerySpellDetailsButton>
									</li>
								))}
						</ul>
					</FieldInput>
				</Field>
			)}
		</>
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
