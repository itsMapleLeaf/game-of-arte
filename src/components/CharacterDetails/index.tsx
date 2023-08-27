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
						<FieldLabel>Reference Image</FieldLabel>
						<FieldDescription>What do they look like?</FieldDescription>
						<FieldInput asChild>
							<DataImageInput character={character} dataKey="image" />
						</FieldInput>
					</Field>
				</section>

				<section className={column()}>
					<h3 className={sectionHeading()}>Status</h3>

					{character.isOwner && (
						<Field>
							<FieldLabel>Notes</FieldLabel>
							<FieldDescription>
								Anything else important about the character. Only you can see
								this.
							</FieldDescription>
							<FieldInput asChild>
								<DataTextArea
									character={character}
									dataKey="notes"
									className={textArea("max-h-40")}
								/>
							</FieldInput>
						</Field>
					)}

					{character.isOwner && (
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
					)}

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
				{attributes.map(({ title, attributes }) => (
					<div key={title} className={column("gap-4")}>
						<h3 className={sectionHeading()}>{title}</h3>
						{attributes
							.toSorted((a, b) => a.name.localeCompare(b.name))
							.map((item) => ({
								...item,
								dataKey: item.dataKey ?? item.name.toLowerCase(),
							}))
							.map(({ name, description, dataKey }) => (
								<AttributeInput
									key={dataKey}
									character={character}
									dataKey={dataKey}
									attributeName={name}
									attributeDescription={description}
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
			const key = attribute.dataKey ?? attribute.name.toLowerCase()
			return toFiniteNumberOrUndefined(character.data[key]) ?? 1
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
