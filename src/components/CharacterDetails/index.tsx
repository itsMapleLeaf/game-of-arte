import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { LucideDices, LucideLock, LucideUnlock } from "lucide-react"
import { cloneElement } from "react"
import * as v from "valibot"
import { parseNonNil } from "../../helpers/errors.ts"
import { randomItem, toFiniteNumberOrUndefined } from "../../helpers/index.ts"
import { useCurrentCharacter } from "../../helpers/useCurrentCharacter.ts"
import { useLocalStorageState } from "../../helpers/useLocalStorageState.tsx"
import { useQuerySuspense } from "../../helpers/useQuerySuspense.ts"
import { solidButton } from "../../styles/button.ts"
import { center, input, textArea } from "../../styles/index.ts"
import { panel } from "../../styles/panel.ts"
import { ConfirmDialog } from "../ConfirmDialog.tsx"
import {
	Field,
	FieldDescription,
	FieldInput,
	FieldLabel,
	FieldLabelText,
} from "../Field.tsx"
import { AttributeInput } from "./AttributeInput.tsx"
import {
	DataCounterInput,
	DataImageInput,
	DataInput,
	DataSelectInput,
	DataTextArea,
} from "./DataInput.tsx"
import { NameInput } from "./NameInput.tsx"
import {
	allAttributes,
	attributes,
	knowledgeAttributeCategory,
	mentalAttributeCategory,
	physicalAttributeCategory,
	socialAttributeCategory,
} from "./attributes.ts"
import { column, row, sectionHeading } from "./styles.ts"

const getStressModifier = (
	character: Doc<"characters">,
	attributeSectionTitle: string,
): number => {
	const stressValue =
		attributeSectionTitle === "Physical"
			? character.data.physicalStress
			: character.data.mentalStress

	return (toFiniteNumberOrUndefined(stressValue) ?? 0) * -1
}

export function CharacterDetails() {
	const character = useCurrentCharacter()
	const ownedCharacter = useQuerySuspense(api.characters.getOwned)
	const roles = useQuerySuspense(api.roles.get)

	const [attributesLocked, setAttributesLocked] = useLocalStorageState(
		"attributesLocked",
		(value) => v.parse(v.fallback(v.boolean(), false), value),
	)

	function getAttributesEditable(character: Doc<"characters">) {
		if (!roles.isAdmin && character._id !== ownedCharacter?._id) return false
		return !attributesLocked
	}

	if (!character) {
		return <p>No characters found.</p>
	}

	return (
		<div className="grid flex-1 content-start gap-3 self-start">
			<div className={row("fluid-cols-48")}>
				<section className={column()}>
					<h3 className={sectionHeading()}>Info</h3>

					<NameInput character={character} />

					<Field>
						<FieldLabel>Pronouns</FieldLabel>
						<FieldDescription>How do they identify?</FieldDescription>
						<FieldInput asChild>
							<DataInput
								character={character}
								dataKey="pronouns"
								className={input()}
							/>
						</FieldInput>
					</Field>

					<Field>
						<FieldLabel>Archetype</FieldLabel>
						<FieldDescription>
							The backbone of your character. Gives +2 dice to the corresponding
							attribute category.
						</FieldDescription>
						<FieldInput asChild>
							<DataSelectInput
								character={character}
								dataKey="archetype"
								className={input("py-0")}
							>
								<option disabled value="">
									Select an archetype
								</option>
								{attributes.map((category) => (
									<option key={category.id} value={category.archetypeId}>
										{category.archetypeName}
									</option>
								))}
							</DataSelectInput>
						</FieldInput>
					</Field>

					<Field>
						<FieldLabel>Reference Image</FieldLabel>
						<FieldDescription>What do they look like?</FieldDescription>
						<FieldInput asChild>
							<DataImageInput character={character} dataKey="image" />
						</FieldInput>
					</Field>
				</section>

				<section className={column()}>
					<h3 className={sectionHeading()}>Status</h3>

					<Field>
						<FieldLabel>Notes</FieldLabel>
						<FieldDescription>
							Anything else important about the character.
						</FieldDescription>
						<FieldInput asChild>
							<DataTextArea
								character={character}
								dataKey="notes"
								className={textArea("max-h-64")}
							/>
						</FieldInput>
					</Field>

					<Field>
						<FieldLabel>Inventory</FieldLabel>
						<FieldDescription>What are you carrying?</FieldDescription>
						<FieldInput asChild>
							<DataTextArea
								character={character}
								dataKey="inventory"
								className={textArea("max-h-64")}
							/>
						</FieldInput>
					</Field>

					<Field>
						<FieldLabelText>Experience</FieldLabelText>
						<FieldDescription>
							Spend these points on attributes!
						</FieldDescription>
						<ExperienceDisplay character={character} />
					</Field>

					<div className={row("items-end gap-2")}>
						<Field>
							<FieldLabelText>Resilience</FieldLabelText>
							<DataCounterInput
								character={character}
								dataKey="resilience"
								min={0}
								defaultValue={2}
							/>
						</Field>

						<Field>
							<FieldLabelText>Phys. Stress</FieldLabelText>
							<DataCounterInput
								character={character}
								dataKey="physicalStress"
								min={0}
								max={6}
								defaultValue={0}
							/>
						</Field>

						<Field>
							<FieldLabelText>Ment. Stress</FieldLabelText>
							<DataCounterInput
								character={character}
								dataKey="mentalStress"
								min={0}
								max={6}
								defaultValue={0}
							/>
						</Field>
					</div>

					<Field>
						<FieldLabel>Condition</FieldLabel>
						<FieldDescription>
							{`Write specifics about the stress they've taken.`}
						</FieldDescription>
						<FieldInput asChild>
							<DataTextArea
								character={character}
								dataKey="condition"
								className={textArea("max-h-40")}
							/>
						</FieldInput>
					</Field>

					<div className={row("fluid-cols-36")}>
						<RandomizeStatsButton character={character} />
						{attributesLocked ? (
							<button
								type="button"
								className={solidButton()}
								onClick={() => setAttributesLocked(!attributesLocked)}
							>
								<LucideUnlock /> Unlock Stats
							</button>
						) : (
							<button
								type="button"
								className={solidButton()}
								onClick={() => setAttributesLocked(!attributesLocked)}
							>
								<LucideLock /> Lock Stats
							</button>
						)}
					</div>
				</section>
			</div>

			<div className={row("content-center fluid-cols-36")}>
				{attributes.map(({ title, attributes, archetypeId }) => (
					<div key={title} className={column("gap-4")}>
						<h3
							className={sectionHeading(
								"transition-colors",
								character.data.archetype === archetypeId && "text-accent-400",
							)}
						>
							{title}
						</h3>
						{attributes.map(({ name, description, dataKey }) => (
							<AttributeInput
								key={dataKey}
								character={character}
								dataKey={dataKey}
								attributeName={name}
								attributeDescription={description}
								stressModifier={getStressModifier(character, title)}
								isArchetypeAttribute={character.data.archetype === archetypeId}
								editable={getAttributesEditable(character)}
							/>
						))}
					</div>
				))}
			</div>

			<section className={column("gap-2")}>
				<h3 className={sectionHeading()}>Background</h3>
				<p>
					{`Write your character's backstory. Doesn't have to be too long. Unless you want it
					to be!`}
				</p>
				<DataTextArea
					character={character}
					dataKey="background"
					rows={3}
					className={textArea()}
				/>
			</section>
		</div>
	)
}

function ExperienceDisplay({ character }: { character: Doc<"characters"> }) {
	const world = useQuerySuspense(api.world.get)
	const usedExperience = getUsedExperience(character)

	return (
		<FieldInput asChild>
			<p
				data-negative={usedExperience > world.experience}
				className={panel(
					input(),
					center(),
					"h-auto tabular-nums data-[negative=true]:text-error-400",
				)}
			>
				{world.experience - usedExperience} <span aria-label="out of">/</span>{" "}
				{world.experience}
			</p>
		</FieldInput>
	)
}

function RandomizeStatsButton({ character }: { character: Doc<"characters"> }) {
	const world = useQuerySuspense(api.world.get)
	const updateCharacterData = useMutation(api.characters.updateData)
	const usedExperience = getUsedExperience(character)

	const randomizeStats = () => {
		const newStats = Object.fromEntries(
			allAttributes.map((attribute) => [attribute.dataKey, 1]),
		)

		for (let i = 0; i < world.experience; i++) {
			const category = parseNonNil(
				randomItemWeighted([
					[physicalAttributeCategory, 1],
					[mentalAttributeCategory, 1],
					[socialAttributeCategory, 1],
					[knowledgeAttributeCategory, 0.5],
				]),
			)

			const attributeKey = parseNonNil(
				randomItem(category.attributes.map((a) => a.dataKey)),
			)

			// if the attribute is already at 5, try again
			if (newStats[attributeKey] === 5) {
				i -= 1
				continue
			}

			newStats[attributeKey] += 1
		}

		const archetypes = attributes.map((category) => category.archetypeId)

		updateCharacterData({
			id: character._id,
			data: {
				...newStats,
				archetype: parseNonNil(randomItem(archetypes)),
			},
		})
	}

	const button = (
		<button type="button" className={solidButton()}>
			<LucideDices /> Random Stats
		</button>
	)

	if (usedExperience === 0) {
		return cloneElement(button, { onClick: randomizeStats })
	}

	return (
		<ConfirmDialog
			title="Randomize Stats"
			description="Are you sure you want to randomize your stats? All your current stats will be lost!"
			confirmText="Randomize Stats"
			onConfirm={randomizeStats}
		>
			{button}
		</ConfirmDialog>
	)
}

function getUsedExperience(character: Doc<"characters">) {
	return allAttributes.reduce((sum, attribute) => {
		const value = toFiniteNumberOrUndefined(character.data[attribute.dataKey])
		return sum + (value ?? 1) - 1
	}, 0)
}

function randomItemWeighted<
	Items extends readonly [item: unknown, weight: number][],
>(items: Items): Items[number][0] | undefined {
	const totalWeight = items.reduce((sum, [, weight]) => sum + weight, 0)

	const normalizedItems = items.map(
		([item, weight]) => [item, weight / totalWeight] as const,
	)

	const randomValue = Math.random()

	return normalizedItems.find(([, weight]) => randomValue < weight)?.[0]
}
