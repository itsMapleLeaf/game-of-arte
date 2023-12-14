import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import {
	LucideBookOpenText,
	LucideBookTemplate,
	LucideDices,
	LucideLock,
	LucideUnlock,
	LucideWand,
} from "lucide-react"
import { type ReactElement, type ReactNode, useEffect } from "react"
import ExpandingTextArea from "react-expanding-textarea"
import { CharacterAttributeField } from "~/features/characters/CharacterAttributeField.tsx"
import {
	type AttributeCategory,
	getAttributeCategories,
	getAttributes,
} from "~/features/characters/attributes"
import { useLocalStorageState } from "~/helpers/useLocalStorageState.tsx"
import { Button, type ButtonProps } from "~/ui/Button.tsx"
import { ConfirmDialog } from "~/ui/ConfirmDialog.tsx"
import { CounterInput } from "~/ui/CounterInput.tsx"
import {
	Field,
	FieldDescription,
	FieldInput,
	FieldLabelText,
} from "~/ui/Field.tsx"
import { ImageInput } from "~/ui/ImageInput.tsx"
import { Input } from "~/ui/Input.tsx"
import { LoadingPlaceholder } from "~/ui/LoadingPlaceholder.tsx"
import { panel } from "~/ui/styles.ts"
import { center, input, textArea } from "~/ui/styles.ts"
import { twMerge } from "~/ui/twMerge.ts"
import { twStyle } from "~/ui/twStyle.ts"
import { AddFreeformSpellButton } from "../sorcery/AddFreeformSpellButton.tsx"
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
	const assignedCharacterId = useQuery(api.players.getAssignedCharacterId)

	const [attributesLocked, setAttributesLocked] = useLocalStorageState(
		"attributesLocked",
		(value) => (typeof value === "boolean" ? value : false),
	)

	const attributesEditable = (() => {
		if (!roles?.isAdmin && character._id !== assignedCharacterId) return false
		return !attributesLocked
	})()

	return (
		<div className="grid flex-1 content-start gap-8 self-start">
			<div className={row("fluid-cols-48")}>
				<IdentitySection character={character} />

				<div className={column()}>
					<StatusSection character={character} />
					<SorcerySection character={character} />
				</div>
			</div>

			<ProgressionSection
				character={character}
				attributesLocked={attributesLocked}
				onAttributesLockedChange={setAttributesLocked}
			/>

			<div className={row("content-center fluid-cols-36")}>
				{getAttributeCategories().map((category) => (
					<AttributeCategorySection
						key={category.id}
						character={character}
						category={category}
						editable={attributesEditable}
					/>
				))}
			</div>

			<DescriptionSection character={character} />
		</div>
	)
}

function IdentitySection({ character }: { character: Doc<"characters"> }) {
	return (
		<Section title="Identity">
			<Field label="Name" description="What should we call them?">
				<FieldInput asChild>
					<Input
						{...useCharacterInputProps(character, "name")}
						id={characterNameInputId}
					/>
				</FieldInput>
			</Field>

			<Field label="Pronouns" description="How do they identify?">
				<FieldInput asChild>
					<Input {...useCharacterDataInputProps(character, "pronouns")} />
				</FieldInput>
			</Field>

			<Field
				label="Archetype"
				description={`The backbone of your character. Gives +2 dice to the corresponding attribute category.`}
			>
				<FieldInput asChild>
					<select
						{...useCharacterDataInputProps(character, "archetype")}
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
						{...useCharacterDataInputProps(character, "notes")}
						className={textArea()}
						rows={4}
					/>
				</FieldInput>
			</Field>

			<Field label="Reference Image" description="Do they have a cool hat?">
				<FieldInput asChild>
					<ImageInput {...useCharacterDataInputProps(character, "image")} />
				</FieldInput>
			</Field>
		</Section>
	)
}

function StatusSection({ character }: { character: Doc<"characters"> }) {
	const { physicalStress, mentalStress } = getCharacterStress(character)
	return (
		<Section title="Status">
			<div className={row("items-end gap-2")}>
				<Field labelText="Resilience">
					<FieldInput asChild>
						<CounterInput
							{...useCharacterDataInputProps(character, "resilience")}
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
		</Section>
	)
}

function SorcerySection({ character }: { character: Doc<"characters"> }) {
	return (
		<Section title="Sorcery">
			{character.sorceryDevice == null ?
				<AddSorceryDeviceButton character={character} />
			:	<>
					<SorceryDeviceEditor
						character={character}
						sorceryDevice={character.sorceryDevice}
					/>

					<section className={column("gap-2")}>
						<CastSpellButton asChild>
							<Button icon={LucideBookOpenText} color="accent">
								Spellbook
							</Button>
						</CastSpellButton>
						<AddFreeformSpellButton character={character} asChild>
							<Button appearance="outline" icon={LucideBookTemplate}>
								Add Freeform Spell
							</Button>
						</AddFreeformSpellButton>
						<RemoveSorceryDeviceButton character={character} />
					</section>
				</>
			}
		</Section>
	)
}

function ProgressionSection({
	character,
	attributesLocked,
	onAttributesLockedChange,
}: {
	character: Doc<"characters">
	attributesLocked: boolean
	onAttributesLockedChange: (value: boolean) => void
}) {
	const world = useQuery(api.world.get)
	const usedExperience = getUsedExperience(character)

	return (
		<Section title="Progression">
			{world === undefined ?
				<LoadingPlaceholder />
			:	<Field>
					<FieldLabelText
						className={twMerge(
							"tabular-nums transition-colors",
							usedExperience < world.experience ? "text-green-400"
							: usedExperience > world.experience ? "text-error-400"
							: "",
						)}
					>
						Experience: {world.experience - usedExperience}
						<span aria-label="out of">/</span>
						{world.experience}
					</FieldLabelText>
					<FieldDescription>Spend these points on attributes!</FieldDescription>
				</Field>
			}

			<div className="flex flex-wrap gap-2">
				<RandomizeStatsButton character={character} />
				{attributesLocked ?
					<Button
						appearance="outline"
						icon={LucideUnlock}
						onClick={() => onAttributesLockedChange(false)}
					>
						Unlock Stats
					</Button>
				:	<Button
						appearance="outline"
						icon={LucideLock}
						onClick={() => onAttributesLockedChange(true)}
					>
						Lock Stats
					</Button>
				}
			</div>
		</Section>
	)
}

function AttributeCategorySection({
	character,
	category,
	editable,
}: {
	character: Doc<"characters">
	category: AttributeCategory
	editable: boolean
}) {
	return (
		<Section
			title={
				<h3
					className={sectionHeading(
						"transition-colors",
						parseCharacterData(character.data).archetype === category.id &&
							"text-accent-400",
					)}
				>
					{category.title}
				</h3>
			}
		>
			{category.attributes.map((attribute) => (
				<CharacterAttributeField
					key={attribute.id}
					attribute={attribute}
					editable={editable}
				/>
			))}
		</Section>
	)
}

function DescriptionSection({ character }: { character: Doc<"characters"> }) {
	return (
		<Section title="Description">
			<Field label="Inventory" description="What are you carrying?">
				<FieldInput asChild>
					<ExpandingTextArea
						{...useCharacterDataInputProps(character, "inventory")}
						className={textArea()}
					/>
				</FieldInput>
			</Field>

			<Field
				label="Background"
				description={`Write your character's backstory. Doesn't have to be too long. Unless you want it to be!`}
			>
				<ExpandingTextArea
					{...useCharacterDataInputProps(character, "background")}
					className={textArea()}
				/>
			</Field>
		</Section>
	)
}

function useCharacterInputProps<K extends keyof UpdateCharacterArgs>(
	character: Doc<"characters">,
	key: K,
) {
	const updateCharacter = useUpdateCharacter().bind(null, character._id)
	return {
		value: character[key],
		onChange: (arg: OnChangeArg<UpdateCharacterArgs[K]>) => {
			updateCharacter({ [key]: resolveOnChangeArg(arg) })
		},
	}
}

function useCharacterDataInputProps<K extends keyof CharacterDataInput>(
	character: Doc<"characters">,
	key: K,
) {
	const updateCharacterData = useUpdateCharacterData().bind(null, character._id)
	const characterData = parseCharacterData(character.data)
	return {
		value: characterData[key],
		onChange: (arg: OnChangeArg<CharacterDataInput[K]>) => {
			updateCharacterData({ [key]: resolveOnChangeArg(arg) })
		},
	}
}

function Section({
	title,
	children,
}: {
	title: string | ReactElement
	children: ReactNode
}) {
	return (
		<div className={column()}>
			{typeof title === "string" ?
				<h3 className={sectionHeading()}>{title}</h3>
			:	title}
			{children}
		</div>
	)
}

function RandomizeStatsButton({ character }: { character: Doc<"characters"> }) {
	const world = useQuery(api.world.get)
	const updateCharacterData = useMutation(api.characters.updateData)
	const usedExperience = getUsedExperience(character)

	const buttonProps: ButtonProps = {
		appearance: "outline",
		icon: LucideDices,
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

	const handleClick = async () => {
		await setSorceryDevice({
			id: character._id,
			sorceryDevice: {
				description: "",
				affinities: null,
			},
		})
	}

	return (
		<Button
			appearance="solid"
			color="accent"
			icon={LucideWand}
			onClick={handleClick}
		>
			Add Sorcery Device
		</Button>
	)
}

function getUsedExperience(character: Doc<"characters">) {
	return getAttributes().reduce((sum, attribute) => {
		const value = getCharacterAttributeValue(character, attribute.id)
		return sum + (value ?? 1) - 1
	}, 0)
}
