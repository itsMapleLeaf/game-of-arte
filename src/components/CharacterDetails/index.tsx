import { api } from "convex/_generated/api"
import { type Id } from "convex/_generated/dataModel"
import ExpandingTextArea from "react-expanding-textarea"
import { useQuerySuspense } from "../../helpers/useQuerySuspense.ts"
import { input, textArea } from "../../styles/index.ts"
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
					<div className={row("gap-2")}>
						<DataInput character={character} dataKey="resilience">
							<Field label="Resilience">
								<NumberInput defaultValue={2} min={0} />
							</Field>
						</DataInput>

						<DataInput character={character} dataKey="physicalStress">
							<Field label="Physical Stress">
								<NumberInput min={0} max={6} />
							</Field>
						</DataInput>

						<DataInput character={character} dataKey="mentalStress">
							<Field label="Mental Stress">
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
				</section>
			</div>

			<div className={row()}>
				{attributes.map(({ title, attributes }) => (
					<div key={title} className={column()}>
						<h3 className={sectionHeading()}>{title}</h3>
						{attributes
							.map((item) =>
								typeof item === "string"
									? { name: item, dataKey: item.toLowerCase() }
									: item,
							)
							.toSorted((a, b) => a.name.localeCompare(b.name))
							.map(({ name, dataKey }) => (
								<DataInput
									key={dataKey}
									character={character}
									dataKey={dataKey}
								>
									<Field label={name}>
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

			<section className={column()}>
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
