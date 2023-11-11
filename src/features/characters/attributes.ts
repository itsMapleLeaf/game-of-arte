import { compareKey, toLowerCaseTyped } from "~/helpers/index.ts"

type GenericAttributeColumn = {
	id?: string
	title: string
	archetypeId?: string
	archetypeName: string
	attributes: readonly Required<GenericAttribute>[]
}

type GenericAttribute = {
	name: string
	description: string
	dataKey?: string
}

function defineAttributeColumn<const T extends GenericAttributeColumn>(
	input: T,
) {
	return {
		id: toLowerCaseTyped<T["title"]>(input.title),
		archetypeId: toLowerCaseTyped<T["archetypeName"]>(input.archetypeName),
		...input,
	}
}

function defineAttribute<const T extends GenericAttribute>(input: T) {
	return {
		dataKey: toLowerCaseTyped<T["name"]>(input.name),
		...input,
	}
}

export const physicalAttributeCategory = defineAttributeColumn({
	title: "Physical",
	archetypeName: "Athlete",
	attributes: [
		defineAttribute({
			name: "Agility",
			description: "Staying quick and nimble on your feet.",
		}),
		defineAttribute({
			name: "Endurance",
			description: "Withstand external or internal forces or ailments.",
		}),
		defineAttribute({
			name: "Stealth",
			description: "Operating quietly, avoiding detection.",
		}),
		defineAttribute({
			name: "Strength",
			description:
				"Solving problems with raw physical prowess and brute force.",
		}),
	].toSorted(compareKey("name")),
})

export const mentalAttributeCategory = defineAttributeColumn({
	title: "Mental",
	archetypeName: "Strategist",
	attributes: [
		defineAttribute({
			name: "Dexterity",
			description:
				"Doing tasks that require great precision and/or attention to detail.",
		}),
		defineAttribute({
			name: "Resolve",
			description:
				"Withstanding mentally taxing or scarring situations, keeping course with your intentions.",
		}),
		defineAttribute({
			name: "Intuition",
			description:
				"Using logic and reason, solving puzzles, mentally connecting the dots.",
		}),
		defineAttribute({
			name: "Perception",
			description:
				"Seeing, hearing, or otherwise detecting the presence of things.",
		}),
	].toSorted(compareKey("name")),
})

export const socialAttributeCategory = defineAttributeColumn({
	title: "Social",
	archetypeName: "Empath",
	attributes: [
		defineAttribute({
			name: "Charm",
			description:
				"Getting on someone’s good side with flattery, seduction, or good looks.",
		}),
		defineAttribute({
			name: "Deception",
			description:
				"Lying through a situation, either directly or by withholding information.",
		}),
		defineAttribute({
			name: "Intimidation",
			description: "Influencing someone with a threatening presence.",
		}),
		defineAttribute({
			name: "Insight",
			description:
				"Gleaning the true thoughts or intentions of a person or creature through their language and mannerisms.",
		}),
		defineAttribute({
			name: "Persuasion",
			description: "Influencing someone with reason.",
		}),
		defineAttribute({
			name: "Performance",
			description:
				"Captivating others with a charismatic aura that demands attention.",
		}),
		defineAttribute({
			name: "Comfort",
			description: "Calming others with a gentle aura.",
		}),
	].toSorted(compareKey("name")),
})

export const knowledgeAttributeCategory = defineAttributeColumn({
	title: "Knowledge",
	archetypeName: "Scholar",
	attributes: [
		defineAttribute({
			name: "Alchemy",
			description:
				"Material synthesis and the handling of ingredients to that end.",
		}),
		defineAttribute({
			name: "Astronomy",
			description: "Celestial bodies and the mysterious ways they work.",
		}),
		defineAttribute({
			name: "World",
			description: "Knowledge of Arte, its history, cultures, and geography.",
		}),
		defineAttribute({
			name: "Nature",
			description:
				"Plants, creatures, weather, spirits, and other natural terrestrial subjects, as well as survival.",
		}),
		defineAttribute({
			name: "Sorcery",
			description: "The act of mana manipulation to various means.",
		}),
		defineAttribute({
			name: "Taboo",
			description: "Demons, curses, and other such occultic matters.",
		}),
		defineAttribute({
			name: "Tech",
			description: "Mechanical contraptions and architecture.",
		}),
	].toSorted(compareKey("name")),
})

export const attributes = [
	physicalAttributeCategory,
	mentalAttributeCategory,
	socialAttributeCategory,
	knowledgeAttributeCategory,
]

export const allAttributes = attributes.flatMap<
	(typeof attributes)[number]["attributes"][number]
>((column) => column.attributes)

export type AttributeCategoryId = (typeof attributes)[number]["id"]
export type AttributeKey = (typeof allAttributes)[number]["dataKey"]
