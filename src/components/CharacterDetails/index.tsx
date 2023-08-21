import { api } from "convex/_generated/api"
import { type Doc, type Id } from "convex/_generated/dataModel"
import { useId } from "react"
import ExpandingTextArea from "react-expanding-textarea"
import { toFiniteNumberOrUndefined } from "../../helpers/index.ts"
import { useQuerySuspense } from "../../helpers/useQuerySuspense.ts"
import {
	field,
	fieldDescription,
	input,
	labelText,
	textArea,
} from "../../styles/index.ts"
import { Field } from "../Field.tsx"
import { AttributeInput } from "./AttributeInput.tsx"
import { DataInput } from "./DataInput.tsx"
import { ImageInput } from "./ImageInput.tsx"
import { NameInput } from "./NameInput.tsx"
import { NumberInput } from "./NumberInput.tsx"
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
			<div className={row()}>
				<section className={column()}>
					<h3 className={sectionHeading()}>Info</h3>
					<NameInput character={character} />
					<DataInput character={character} dataKey="pronouns">
						<Field
							label="Pronouns"
							description="How do they identify?"
							className={input()}
						/>
					</DataInput>
					<DataInput character={character} dataKey="image">
						<Field label="Reference Image">
							<ImageInput />
						</Field>
					</DataInput>
				</section>

				<section className={column()}>
					<h3 className={sectionHeading()}>Status</h3>
					<div className={row("items-end gap-2")}>
						<DataInput character={character} dataKey="resilience">
							<Field label="Resilience">
								<NumberInput defaultValue={2} min={0} />
							</Field>
						</DataInput>

						<DataInput character={character} dataKey="physicalStress">
							<Field label="Phys. Stress">
								<NumberInput min={0} max={6} />
							</Field>
						</DataInput>

						<DataInput character={character} dataKey="mentalStress">
							<Field label="Ment. Stress">
								<NumberInput min={0} max={6} />
							</Field>
						</DataInput>
					</div>

					<DataInput character={character} dataKey="condition">
						<Field
							label="Condition"
							description="Write specifics about the stress they've taken."
						>
							<ExpandingTextArea className={textArea()} />
						</Field>
					</DataInput>

					<DataInput character={character} dataKey="inventory">
						<Field label="Inventory" description="What are you carrying?">
							<ExpandingTextArea className={textArea()} />
						</Field>
					</DataInput>

					<DataInput character={character} dataKey="notes">
						<Field
							label="Notes"
							description="Write anything else we should know, temporary or otherwise. This is public!"
						>
							<ExpandingTextArea className={textArea()} />
						</Field>
					</DataInput>

					<ExperienceDisplay character={character} />
				</section>
			</div>

			<div className={row()}>
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
								<DataInput
									key={dataKey}
									character={character}
									dataKey={dataKey}
								>
									<Field label={name} tooltip={description}>
										<AttributeInput
											character={character}
											attributeName={name}
										/>
									</Field>
								</DataInput>
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
				<DataInput character={character} dataKey="background">
					<ExpandingTextArea rows={5} className={textArea()} />
				</DataInput>
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

	const labelId = useId()
	const description = useId()

	return (
		<div className={field()}>
			<p id={labelId} className={labelText()}>
				Experience
			</p>
			<p id={description} className={fieldDescription()}>
				Spend these points on attributes!
			</p>
			<p
				aria-labelledby={labelId}
				aria-describedby={description}
				data-negative={usedExperience > world.experience}
				className={input("data-[negative=true]:text-error-400")}
			>
				{world.experience - usedExperience} <span aria-label="out of">/</span>{" "}
				{world.experience}
			</p>
		</div>
	)
}
