import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import {
	LucideBookOpenText,
	LucideDices,
	LucideLock,
	LucideUnlock,
	LucideWand,
} from "lucide-react"
import { useEffect } from "react"
import ExpandingTextArea from "react-expanding-textarea"
import { AsyncButton } from "~/components/AsyncButton.tsx"
import { Button, type ButtonProps } from "~/components/Button.tsx"
import { ConfirmDialog } from "~/components/ConfirmDialog.tsx"
import { CounterInput } from "~/components/CounterInput.tsx"
import { Field, FieldInput } from "~/components/Field.tsx"
import { ImageInput } from "~/components/ImageInput.tsx"
import { Input } from "~/components/Input.tsx"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import { AttributeInput } from "~/features/characters/AttributeInput"
import {
	getAttributeCategories,
	getAttributes,
} from "~/features/characters/attributes"
import { useLocalStorageState } from "~/helpers/useLocalStorageState.tsx"
import { solidButton } from "~/styles/button.ts"
import { center, input, textArea } from "~/styles/index.ts"
import { panel } from "~/styles/panel.ts"
import { twStyle } from "~/styles/twStyle.ts"
import { CastSpellButton } from "../sorcery/CastSpellButton.tsx"
import { RemoveSorceryDeviceButton } from "../sorcery/RemoveSorceryDeviceButton.tsx"
import { SorceryDeviceEditor } from "../sorcery/SorceryDeviceEditor.tsx"
import { CharacterConditions } from "./CharacterConditions.tsx"
import { MentalStressIndicator } from "./MentalStressIndicator.tsx"
import { PhysicalStressIndicator } from "./PhysicalStressIndicator.tsx"
import {
	type CharacterDataInput,
	getCharacterAttributeValue,
	getCharacterStress,
	parseCharacterData,
} from "./data.ts"
import { generateRandomStats } from "./generateRandomStats.tsx"
import {
	type UpdateCharacterArgs,
	useUpdateCharacter,
} from "./useUpdateCharacter.tsx"
import { useUpdateCharacterData } from "./useUpdateCharacterData.ts"

export const characterNameInputId = "characterNameInput"

const row = twStyle("grid gap-3 fluid-cols-auto-fit fluid-cols-24")

const column = twStyle("grid content-start gap-4")

const sectionHeading = twStyle(
	"border-b border-base-800 pb-1 text-2xl font-light",
)

type OnChangeArg<T> = { currentTarget: { value: T } } | T

const resolveOnChangeArg = <T,>(eventOrValue: OnChangeArg<T>) =>
	(
		typeof eventOrValue === "object" &&
		eventOrValue !== null &&
		"currentTarget" in eventOrValue
	) ?
		eventOrValue.currentTarget.value
	:	eventOrValue

export function CharacterDetails({
	character,
}: {
	character: Doc<"characters">
}) {
	useEffect(() => {
		document.title = `${character.name} | Game of Arte`
		return () => {
			document.title = "Game of Arte"
		}
	})

	const roles = useQuery(api.roles.get)
	const self = useQuery(api.players.self)

	const updateCharacter = useUpdateCharacter().bind(null, character._id)
	const updateCharacterData = useUpdateCharacterData().bind(null, character._id)
	const characterData = parseCharacterData(character.data)
	const { physicalStress, mentalStress } = getCharacterStress(character)

	const [attributesLocked, setAttributesLocked] = useLocalStorageState(
		"attributesLocked",
		(value) => (typeof value === "boolean" ? value : false),
	)

	const characterInputProps = <K extends keyof UpdateCharacterArgs>(
		key: K,
	) => ({
		value: character[key],
		onChange: (arg: OnChangeArg<UpdateCharacterArgs[K]>) => {
			updateCharacter({ [key]: resolveOnChangeArg(arg) })
		},
	})

	const characterDataInputProps = <K extends keyof CharacterDataInput>(
		key: K,
	) => ({
		value: characterData[key],
		onChange: (arg: OnChangeArg<CharacterDataInput[K]>) => {
			updateCharacterData({ [key]: resolveOnChangeArg(arg) })
		},
	})

	const attributesEditable = (() => {
		if (!roles?.isAdmin && character._id !== self?.ownedCharacterId)
			return false
		return !attributesLocked
	})()

	return (
		<div className="grid flex-1 content-start gap-8 self-start">
			<div className={row("fluid-cols-48")}>
				<section className={column()}>
					<h3 className={sectionHeading()}>Identity</h3>

					<Field label="Name" description="What should we call them?">
						<FieldInput asChild>
							<Input
								{...characterInputProps("name")}
								id={characterNameInputId}
							/>
						</FieldInput>
					</Field>

					<Field label="Pronouns" description="How do they identify?">
						<FieldInput asChild>
							<Input {...characterDataInputProps("pronouns")} />
						</FieldInput>
					</Field>

					<Field
						label="Archetype"
						description={`The backbone of your character. Gives +2 dice to the corresponding attribute category.`}
					>
						<FieldInput asChild>
							<select
								{...characterDataInputProps("archetype")}
								value={character.data.archetype ?? ""} // need to use empty string to set the default value
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
							</select>
						</FieldInput>
					</Field>

					<Field
						label="Notes"
						description="Anything else important about the character."
					>
						<FieldInput asChild>
							<textarea
								{...characterDataInputProps("notes")}
								className={textArea()}
								rows={4}
							/>
						</FieldInput>
					</Field>

					<Field label="Reference Image" description="Do they have a cool hat?">
						<FieldInput asChild>
							<ImageInput {...characterDataInputProps("image")} />
						</FieldInput>
					</Field>
				</section>

				<div className={column()}>
					<section className={column()}>
						<h3 className={sectionHeading()}>Status</h3>

						<div className={row("items-end gap-2")}>
							<Field labelText="Resilience">
								<FieldInput asChild>
									<CounterInput
										{...characterDataInputProps("resilience")}
										min={0}
										defaultValue={2}
									/>
								</FieldInput>
							</Field>

							<Field labelText="Stress">
								<FieldInput asChild>
									<p className={panel(input(), center(), "h-10 gap-3")}>
										<PhysicalStressIndicator value={physicalStress} />
										<MentalStressIndicator value={mentalStress} />
									</p>
								</FieldInput>
							</Field>
						</div>

						<Field
							labelText="Conditions"
							description="List your character's sources of stress."
						>
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

								{(character._id === self?.ownedCharacterId ||
									roles?.isAdmin) && (
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

						<Field
							labelText="Experience"
							description="Spend these points on attributes!"
						>
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
								editable={attributesEditable}
							/>
						))}
					</div>
				))}
			</div>

			<section className={column()}>
				<h3 className={sectionHeading()}>Description</h3>

				<Field label="Inventory" description="What are you carrying?">
					<FieldInput asChild>
						<ExpandingTextArea
							{...characterDataInputProps("inventory")}
							className={textArea()}
						/>
					</FieldInput>
				</Field>

				<Field
					label="Background"
					description={`Write your character's backstory. Doesn't have to be too long. Unless you want it to be!`}
				>
					<ExpandingTextArea
						{...characterDataInputProps("background")}
						className={textArea()}
					/>
				</Field>
			</section>
		</div>
	)
}

function ExperienceDisplay({ character }: { character: Doc<"characters"> }) {
	const world = useQuery(api.world.get)
	const usedExperience = getUsedExperience(character)

	return (
		<FieldInput asChild>
			{world === undefined ?
				<LoadingPlaceholder />
			:	<p
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
			}
		</FieldInput>
	)
}

function RandomizeStatsButton({ character }: { character: Doc<"characters"> }) {
	const world = useQuery(api.world.get)
	const updateCharacterData = useMutation(api.characters.updateData)
	const usedExperience = getUsedExperience(character)

	const buttonProps: ButtonProps = {
		appearance: "outline",
		icon: { start: LucideDices },
		children: "Random Stats",
	}

	if (world === undefined) {
		return <Button {...buttonProps} pending />
	}

	const randomizeStats = async () => {
		const { stats, archetype } = generateRandomStats(world.experience)
		await updateCharacterData({
			id: character._id,
			data: {
				...stats,
				archetype,
			},
		})
	}

	if (usedExperience === 0) {
		return <Button {...buttonProps} onClick={randomizeStats} />
	}

	return (
		<ConfirmDialog
			title="Randomize Stats"
			description="Are you sure you want to randomize your stats? All your current stats will be lost!"
			confirmText="Randomize Stats"
			onConfirm={randomizeStats}
		>
			<Button {...buttonProps} />
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

function getUsedExperience(character: Doc<"characters">) {
	return getAttributes().reduce((sum, attribute) => {
		const value = getCharacterAttributeValue(character, attribute.id)
		return sum + (value ?? 1) - 1
	}, 0)
}
