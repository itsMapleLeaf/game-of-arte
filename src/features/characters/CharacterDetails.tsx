import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { LucideDices, LucideLock, LucideUnlock, LucideWand } from "lucide-react"
import { cloneElement } from "react"
import type { ClassNameValue } from "tailwind-merge"
import * as v from "valibot"
import { AsyncButton } from "~/components/AsyncButton.tsx"
import { ConfirmDialog } from "~/components/ConfirmDialog.tsx"
import {
	Field,
	FieldDescription,
	FieldInput,
	FieldLabel,
	FieldLabelText,
} from "~/components/Field.tsx"
import { AttributeInput } from "~/features/characters/AttributeInput"
import {
	CharacterDataCounterInput,
	CharacterDataImageInput,
	CharacterDataInput,
	CharacterDataSelectInput,
	CharacterDataTextArea,
} from "~/features/characters/CharacterDataInput"
import { CharacterNameInput } from "~/features/characters/CharacterNameInput"
import {
	allAttributes,
	attributes,
	knowledgeAttributeCategory,
	mentalAttributeCategory,
	physicalAttributeCategory,
	socialAttributeCategory,
} from "~/features/characters/attributes"
import { useCurrentCharacter } from "~/features/characters/useCurrentCharacter.tsx"
import { expectNonNil } from "~/helpers/errors.ts"
import { randomItem, toFiniteNumberOrUndefined } from "~/helpers/index.ts"
import { useLocalStorageState } from "~/helpers/useLocalStorageState.tsx"
import { useQuerySuspense } from "~/helpers/useQuerySuspense.ts"
import { solidButton } from "~/styles/button.ts"
import { center, input, textArea } from "~/styles/index.ts"
import { panel } from "~/styles/panel.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { SorceryDeviceEditor } from "../sorcery/SorceryDeviceEditor.tsx"

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
		<div className="grid flex-1 content-start gap-8 self-start">
			<div className={row("fluid-cols-48")}>
				<section className={column()}>
					<h3 className={sectionHeading()}>Identity</h3>

					<CharacterNameInput character={character} />

					<Field>
						<FieldLabel>Pronouns</FieldLabel>
						<FieldDescription>How do they identify?</FieldDescription>
						<FieldInput asChild>
							<CharacterDataInput
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
							<CharacterDataSelectInput
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
							</CharacterDataSelectInput>
						</FieldInput>
					</Field>

					<Field>
						<FieldLabel>Reference Image</FieldLabel>
						<FieldDescription>What do they look like?</FieldDescription>
						<FieldInput asChild>
							<CharacterDataImageInput character={character} dataKey="image" />
						</FieldInput>
					</Field>
				</section>

				<div className={column()}>
					<section className={column()}>
						<h3 className={sectionHeading()}>Status</h3>

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
								<CharacterDataCounterInput
									character={character}
									dataKey="resilience"
									min={0}
									defaultValue={2}
								/>
							</Field>

							<Field>
								<FieldLabelText>Phys. Stress</FieldLabelText>
								<CharacterDataCounterInput
									character={character}
									dataKey="physicalStress"
									min={0}
									max={6}
									defaultValue={0}
								/>
							</Field>

							<Field>
								<FieldLabelText>Ment. Stress</FieldLabelText>
								<CharacterDataCounterInput
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
								<CharacterDataTextArea
									character={character}
									dataKey="condition"
									className={textArea("max-h-40")}
								/>
							</FieldInput>
						</Field>

						<div className={row("fluid-cols-36")}>
							<RandomizeStatsButton character={character} />
							{attributesLocked ?
								<button
									type="button"
									className={solidButton()}
									onClick={() => setAttributesLocked(!attributesLocked)}
								>
									<LucideUnlock /> Unlock Stats
								</button>
							:	<button
									type="button"
									className={solidButton()}
									onClick={() => setAttributesLocked(!attributesLocked)}
								>
									<LucideLock /> Lock Stats
								</button>
							}
						</div>
					</section>

					<section className={column()}>
						<h3 className={sectionHeading()}>Sorcery</h3>

						{character.sorceryDevice == null ?
							<AddSorceryDeviceButton character={character} />
						:	<SorceryDeviceEditor
								character={character}
								sorceryDevice={character.sorceryDevice}
							/>
						}
					</section>
				</div>
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

			<section className={column()}>
				<h3 className={sectionHeading()}>Description</h3>

				<Field>
					<FieldLabel>Inventory</FieldLabel>
					<FieldDescription>What are you carrying?</FieldDescription>
					<FieldInput asChild>
						<CharacterDataTextArea
							character={character}
							dataKey="inventory"
							className={textArea()}
							rows={3}
						/>
					</FieldInput>
				</Field>

				<Field>
					<FieldLabel>Notes</FieldLabel>
					<FieldDescription>
						Anything else important about the character.
					</FieldDescription>
					<FieldInput asChild>
						<CharacterDataTextArea
							character={character}
							dataKey="notes"
							className={textArea()}
							rows={3}
						/>
					</FieldInput>
				</Field>

				<Field>
					<FieldLabel>Background</FieldLabel>
					<FieldDescription>
						{`Write your character's backstory. Doesn't have to be too long. Unless you want it
						to be!`}
					</FieldDescription>
					<CharacterDataTextArea
						character={character}
						dataKey="background"
						rows={3}
						className={textArea()}
					/>
				</Field>
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
		// NOTE: if this function fails again, extract the logic and write a test
		const newStats = Object.fromEntries(
			allAttributes.map((attribute) => [attribute.dataKey, 1]),
		)

		for (let i = 0; i < world.experience; i++) {
			const category = randomItemWeighted([
				[physicalAttributeCategory, 1] as const,
				[mentalAttributeCategory, 1] as const,
				[socialAttributeCategory, 1] as const,
				[knowledgeAttributeCategory, 0.5] as const,
			])

			const attributeKey = expectNonNil(
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
				archetype: expectNonNil(randomItem(archetypes)),
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

function AddSorceryDeviceButton({
	character,
}: {
	character: Doc<"characters">
}) {
	const setSorceryDevice = useMutation(api.characters.setSorceryDevice)
	return (
		<AsyncButton
			type="button"
			className={solidButton()}
			onClick={() => {
				return setSorceryDevice({
					id: character._id,
					sorceryDevice: {
						description: "",
						affinities: null,
					},
				})
			}}
		>
			<LucideWand /> Add Sorcery Device
		</AsyncButton>
	)
}

const row = (...classes: ClassNameValue[]) =>
	twMerge("grid gap-3 fluid-cols-auto-fit fluid-cols-24", ...classes)

const column = (...classes: ClassNameValue[]) =>
	twMerge("grid content-start gap-4", ...classes)

const sectionHeading = (...classes: ClassNameValue[]) =>
	twMerge("border-b border-base-800 pb-1 text-2xl font-light", ...classes)

const getStressModifier = (
	character: Doc<"characters">,
	attributeSectionTitle: string,
): number => {
	const stressValue =
		attributeSectionTitle === "Physical" ?
			character.data.physicalStress
		:	character.data.mentalStress

	return (toFiniteNumberOrUndefined(stressValue) ?? 0) * -1
}

function getUsedExperience(character: Doc<"characters">) {
	return allAttributes.reduce((sum, attribute) => {
		const value = toFiniteNumberOrUndefined(character.data[attribute.dataKey])
		return sum + (value ?? 1) - 1
	}, 0)
}

function randomItemWeighted<
	Items extends readonly (readonly [item: unknown, weight: number])[],
>(items: Items): Items[number][0] {
	const totalWeight = items.reduce((sum, [, weight]) => sum + weight, 0)

	const itemsWithDistributions: [Items[number][0], number][] = []
	let currentDistribution = 0
	for (const [item, weight] of items) {
		currentDistribution += weight / totalWeight
		itemsWithDistributions.push([item, currentDistribution])
	}

	const randomValue = Math.random()
	return itemsWithDistributions.find(([, weight]) => randomValue < weight)?.[0]
}
