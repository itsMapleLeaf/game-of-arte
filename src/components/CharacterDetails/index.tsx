import { api } from "convex/_generated/api"
import { type Doc, type Id } from "convex/_generated/dataModel"
import { toFiniteNumberOrUndefined } from "../../helpers/index.ts"
import { useQuerySuspense } from "../../helpers/useQuerySuspense.ts"
import { input, textArea } from "../../styles/index.ts"
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
import { attributes } from "./attributes.ts"
import { column, row, sectionHeading } from "./styles.ts"

export function CharacterDetails({
	characterId,
}: {
	characterId: Id<"characters">
}) {
	const character = useQuerySuspense(api.characters.get, {
		id: characterId,
	})

	function getStressModifier(
		character: Doc<"characters">,
		attributeSectionTitle: string,
	): number {
		const stressValue =
			attributeSectionTitle === "Physical"
				? character.data.physicalStress
				: character.data.mentalStress

		return (toFiniteNumberOrUndefined(stressValue) ?? 0) * -1
	}

	return !character ? (
		<p>Character not found</p>
	) : (
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
								className={textArea("max-h-40")}
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
								className={textArea("max-h-40")}
							/>
						</FieldInput>
					</Field>

					<ExperienceDisplay character={character} />

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

	const usedExperience = attributes
		.flatMap((group) => group.attributes)
		.map((attribute) => {
			return toFiniteNumberOrUndefined(character.data[attribute.dataKey]) ?? 1
		})
		.reduce((sum, value) => sum + value - 1, 0)

	return (
		<Field>
			<FieldLabelText>Experience</FieldLabelText>
			<FieldDescription>Spend these points on attributes!</FieldDescription>
			<FieldInput asChild>
				<p
					data-negative={usedExperience > world.experience}
					className={input("data-[negative=true]:text-error-400")}
				>
					{world.experience - usedExperience} <span aria-label="out of">/</span>{" "}
					{world.experience}
				</p>
			</FieldInput>
		</Field>
	)
}
