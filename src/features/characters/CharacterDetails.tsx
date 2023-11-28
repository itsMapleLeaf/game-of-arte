import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import {
	LucideBookOpenText,
	LucideDices,
	LucideLock,
	LucideUnlock,
	LucideWand,
} from "lucide-react"
import { cloneElement } from "react"
import type { ClassNameValue } from "tailwind-merge"
import * as v from "valibot"
import { AsyncButton } from "~/components/AsyncButton.tsx"
import { Button } from "~/components/Button.tsx"
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
	getAttributeCategories,
	getAttributeCategoryById,
	getAttributes,
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
import { CastSpellButton } from "../sorcery/CastSpellButton.tsx"
import { RemoveSorceryDeviceButton } from "../sorcery/RemoveSorceryDeviceButton.tsx"
import { SorceryDeviceEditor } from "../sorcery/SorceryDeviceEditor.tsx"
import { CharacterConditions } from "./CharacterConditions.tsx"
import { CharacterContext } from "./CharacterContext.tsx"
import { MentalStressIndicator } from "./MentalStressIndicator.tsx"
import { PhysicalStressIndicator } from "./PhysicalStressIndicator.tsx"
import { getCharacterStress } from "./data.ts"

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

	const { physicalStress, mentalStress } = getCharacterStress(character)

	return (
		<CharacterContext.Provider value={character}>
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
								The backbone of your character. Gives +2 dice to the
								corresponding attribute category.
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
									{getAttributeCategories().map((category) => (
										<option key={category.id} value={category.id}>
											{category.archetypeName}
										</option>
									))}
								</CharacterDataSelectInput>
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
									rows={4}
									fixedHeight
								/>
							</FieldInput>
						</Field>

						<Field>
							<FieldLabel>Reference Image</FieldLabel>
							<FieldDescription>What do they look like?</FieldDescription>
							<FieldInput asChild>
								<CharacterDataImageInput
									character={character}
									dataKey="image"
								/>
							</FieldInput>
						</Field>
					</section>

					<div className={column()}>
						<section className={column()}>
							<h3 className={sectionHeading()}>Status</h3>

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
									<FieldLabelText>Stress</FieldLabelText>
									<FieldInput asChild>
										<p className={panel(input(), center(), "h-10 gap-3")}>
											<PhysicalStressIndicator value={physicalStress} />
											<MentalStressIndicator value={mentalStress} />
										</p>
									</FieldInput>
								</Field>
							</div>

							<Field>
								<FieldLabel>Conditions</FieldLabel>
								<FieldDescription>
									List your character's sources of stress.
								</FieldDescription>
								<CharacterConditions />
							</Field>
						</section>

						<section className={column()}>
							<h3 className={sectionHeading()}>Sorcery</h3>

							{character.sorceryDevice == null ?
								<AddSorceryDeviceButton character={character} />
							:	<>
									<SorceryDeviceEditor
										character={character}
										sorceryDevice={character.sorceryDevice}
									/>

									{(character._id === ownedCharacter?._id || roles.isAdmin) && (
										<section className={column("gap-2")}>
											<CastSpellButton asChild>
												<Button icon={{ start: LucideBookOpenText }}>
													Spellbook
												</Button>
											</CastSpellButton>
											<RemoveSorceryDeviceButton character={character} />
										</section>
									)}
								</>
							}
						</section>

						<section className={column()}>
							<h3 className={sectionHeading()}>Progression</h3>

							<Field>
								<FieldLabelText>Experience</FieldLabelText>
								<FieldDescription>
									Spend these points on attributes!
								</FieldDescription>
								<ExperienceDisplay character={character} />
							</Field>

							<div className={row("fluid-cols-36")}>
								<RandomizeStatsButton character={character} />
								{attributesLocked ?
									<Button
										appearance="outline"
										icon={{ start: LucideUnlock }}
										onClick={() => setAttributesLocked(!attributesLocked)}
									>
										Unlock Stats
									</Button>
								:	<Button
										appearance="outline"
										icon={{ start: LucideLock }}
										onClick={() => setAttributesLocked(!attributesLocked)}
									>
										Lock Stats
									</Button>
								}
							</div>
						</section>
					</div>
				</div>

				<div className={row("content-center fluid-cols-36")}>
					{getAttributeCategories().map((category) => (
						<div key={category.id} className={column("gap-4")}>
							<h3
								className={sectionHeading(
									"transition-colors",
									character.data.archetype === category.id && "text-accent-400",
								)}
							>
								{category.title}
							</h3>
							{category.attributes.map((attribute) => (
								<AttributeInput
									key={attribute.id}
									attribute={attribute}
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
		</CharacterContext.Provider>
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

	const randomizeStats = async () => {
		// NOTE: if this function fails again, extract the logic and write a test
		const newStats = Object.fromEntries(
			getAttributes().map((attribute) => [attribute.id, 1]),
		)

		for (let i = 0; i < world.experience; i++) {
			const category = randomItemWeighted([
				[getAttributeCategoryById("physical"), 1],
				[getAttributeCategoryById("mental"), 1],
				[getAttributeCategoryById("social"), 1],
				[getAttributeCategoryById("knowledge"), 0.5],
			])

			const attribute = expectNonNil(randomItem(category.attributes))

			// if the attribute is already at 5, try again
			if (newStats[attribute.id] === 5) {
				i -= 1
				continue
			}

			newStats[attribute.id] += 1
		}

		await updateCharacterData({
			id: character._id,
			data: {
				...newStats,
				archetype: expectNonNil(
					randomItem(getAttributeCategories().map((category) => category.id)),
				),
			},
		})
	}

	const button = (
		<Button appearance="outline" icon={{ start: LucideDices }}>
			Random Stats
		</Button>
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

function getUsedExperience(character: Doc<"characters">) {
	return getAttributes().reduce((sum, attribute) => {
		const value = toFiniteNumberOrUndefined(character.data[attribute.id])
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
