import type { KeyOfUnion, StrictOmit } from "~/helpers/types.ts"

interface AttributeCategoryInternal {
	title: string
	archetypeName: string
	attributes: Record<string, AttributeInternal>
}

interface AttributeInternal {
	name: string
	description: string
}

const attributeCategoriesInternal = {
	physical: {
		title: "Physical",
		archetypeName: "Athlete",
		attributes: {
			agility: {
				name: "Agility",
				description: `Staying quick and nimble on your feet.`,
			},
			endurance: {
				name: "Endurance",
				description: `Withstand external or internal forces or ailments.`,
			},
			stealth: {
				name: "Stealth",
				description: `Operating quietly, avoiding detection.`,
			},
			strength: {
				name: "Strength",
				description: `Solving problems with raw physical prowess and brute force.`,
			},
		},
	},
	mental: {
		title: "Mental",
		archetypeName: "Strategist",
		attributes: {
			dexterity: {
				name: "Dexterity",
				description: `Doing tasks that require great precision and/or attention to detail.`,
			},
			resolve: {
				name: "Resolve",
				description: `Withstanding mentally taxing or scarring situations, keeping course with your intentions.`,
			},
			intuition: {
				name: "Intuition",
				description: `Using logic and reason, solving puzzles, mentally connecting the dots.`,
			},
			perception: {
				name: "Perception",
				description: `Seeing, hearing, or otherwise detecting the presence of things.`,
			},
		},
	},
	social: {
		title: "Social",
		archetypeName: "Empath",
		attributes: {
			charm: {
				name: "Charm",
				description: `Getting on someone’s good side with flattery, seduction, or good looks.`,
			},
			deception: {
				name: "Deception",
				description: `Lying through a situation, either directly or by withholding information.`,
			},
			intimidation: {
				name: "Intimidation",
				description: `Influencing someone with a threatening presence.`,
			},
			insight: {
				name: "Insight",
				description: `Gleaning the true thoughts or intentions of a person or creature through their language and mannerisms.`,
			},
			persuasion: {
				name: "Persuasion",
				description: `Influencing someone with reason.`,
			},
			performance: {
				name: "Performance",
				description: `Captivating others with a charismatic aura that demands attention.`,
			},
			comfort: {
				name: "Comfort",
				description: `Calming others with a gentle aura.`,
			},
		},
	},
	knowledge: {
		title: "Knowledge",
		archetypeName: "Scholar",
		attributes: {
			materials: {
				name: "Materials",
				description: `Materials, substances, their properties, and interactions.`,
			},
			world: {
				name: "World",
				description: `Knowledge of Arte, its history, cultures, and geography.`,
			},
			nature: {
				name: "Nature",
				description: `Plants, creatures, weather, spirits, and other natural terrestrial subjects, as well as survival.`,
			},
			taboo: {
				name: "Taboo",
				description: `Curses, manipulation of others, and other darker, often forbidden subjects.`,
			},
			tech: {
				name: "Tech",
				description: `Mechanical contraptions and architecture.`,
			},
			metaphysical: {
				name: "Metaphysical",
				description: `The laws of physical reality and manipulation thereof.`,
			},
			psychic: {
				name: "Psychic",
				description: `The Artesian mind and the mysterious ways it works.`,
			},
		},
	},
} satisfies Record<string, AttributeCategoryInternal>

export type AttributeCategoryId = keyof typeof attributeCategoriesInternal
export type AttributeId = KeyOfUnion<
	(typeof attributeCategoriesInternal)[AttributeCategoryId]["attributes"]
>

export interface AttributeCategory
	extends StrictOmit<AttributeCategoryInternal, "attributes"> {
	id: AttributeCategoryId
	attributes: Attribute[]
}

export interface Attribute extends AttributeInternal {
	id: AttributeId
	get category(): AttributeCategory
}

const attributeCategoriesById = Object.fromEntries(
	Object.entries(attributeCategoriesInternal).map(
		([categoryId, categoryBase]) => {
			const category: AttributeCategory = {
				...categoryBase,
				id: categoryId as AttributeCategoryId,
				attributes: Object.entries(categoryBase.attributes)
					.map(([attributeId, attribute]) => ({
						...attribute,
						id: attributeId as AttributeId,
						get category() {
							return category
						},
					}))
					.sort((a, b) => a.name.localeCompare(b.name)),
			}
			return [categoryId, category]
		},
	),
) as Record<AttributeCategoryId, AttributeCategory>
const attributeCategories = Object.values(attributeCategoriesById)

const attributesById = Object.fromEntries(
	Object.entries(attributeCategoriesInternal).flatMap(
		([categoryId, category]) =>
			Object.entries(category.attributes).map(([attributeId, attribute]) => [
				attributeId,
				{
					...attribute,
					id: attributeId,
					category: getAttributeCategoryById(categoryId as AttributeCategoryId),
				},
			]),
	),
) as Record<AttributeId, Attribute>
const attributes = Object.values(attributesById).sort((a, b) =>
	a.name.localeCompare(b.name),
)

export function getAttributeCategories(): AttributeCategory[] {
	return attributeCategories
}

export function getAttributeCategoryById(
	id: AttributeCategoryId,
): AttributeCategory {
	return attributeCategoriesById[id]
}

export function getAttributeById(id: AttributeId): Attribute {
	return attributesById[id]
}

export function getAttributes(): Attribute[] {
	return attributes
}
