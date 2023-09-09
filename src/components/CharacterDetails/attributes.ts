import { compareKey } from "../../helpers/index.ts"

export type CharacterAttributeColumn = ReturnType<typeof defineAttributeColumn>

export type CharacterAttribute = CharacterAttributeColumn["attributes"][number]

function defineAttributeColumn(input: {
	id?: string
	title: string
	archetypeId?: string
	archetypeName: string
	attributes: Array<{
		name: string
		description: string
		dataKey?: string
	}>
}) {
	return {
		...input,
		id: input.id ?? input.title.toLowerCase(),
		archetypeId: input.archetypeId ?? input.archetypeName.toLowerCase(),
		attributes: input.attributes
			.toSorted(compareKey("name"))
			.map((attribute) => ({
				...attribute,
				dataKey: attribute.dataKey ?? attribute.name.toLowerCase(),
			})),
	}
}

export const attributes = [
	defineAttributeColumn({
		title: "Physical",
		archetypeName: "Athlete",
		attributes: [
			{
				name: "Agility",
				description: "Staying quick and nimble on your feet.",
			},
			{
				name: "Endurance",
				description: "Withstand external or internal forces or ailments.",
			},
			{
				name: "Stealth",
				description: "Operating quietly, avoiding detection.",
			},
			{
				name: "Strength",
				description:
					"Solving problems with raw physical prowess and brute force.",
			},
		],
	}),
	defineAttributeColumn({
		title: "Mental",
		archetypeName: "Strategist",
		attributes: [
			{
				name: "Dexterity",
				description:
					"Doing tasks that require great precision and/or attention to detail.",
			},
			{
				name: "Resolve",
				description:
					"Withstanding mentally taxing or scarring situations, keeping course with your intentions.",
			},
			{
				name: "Intuition",
				description:
					"Using logic and reason, solving puzzles, mentally connecting the dots.",
			},
			{
				name: "Perception",
				description:
					"Seeing, hearing, or otherwise detecting the presence of things.",
			},
		],
	}),
	defineAttributeColumn({
		title: "Social",
		archetypeName: "Empath",
		attributes: [
			{
				name: "Charm",
				description:
					"Getting on someone’s good side with flattery, seduction, or good looks.",
			},
			{
				name: "Deception",
				description:
					"Lying through a situation, either directly or by withholding information.",
			},
			{
				name: "Intimidation",
				description: "Influencing someone with a threatening presence.",
			},
			{
				name: "Insight",
				description:
					"Gleaning the true thoughts or intentions of a person or creature through their language and mannerisms.",
			},
			{
				name: "Persuasion",
				description: "Influencing someone with reason.",
			},
			{
				name: "Performance",
				description:
					"Captivating others with a charismatic aura that demands attention.",
			},
			{
				name: "Comfort",
				description: "Calming others with a gentle aura.",
			},
		],
	}),
	defineAttributeColumn({
		title: "Knowledge",
		archetypeName: "Scholar",
		attributes: [
			{
				name: "Alchemy",
				description:
					"Material synthesis and the handling of ingredients to that end.",
			},
			{
				name: "Astronomy",
				description: "Celestial bodies and the mysterious ways they work.",
			},
			{
				name: "World",
				description: "Knowledge of Arte, its history, cultures, and geography.",
			},
			{
				name: "Nature",
				description:
					"Plants, creatures, weather, spirits, and other natural terrestrial subjects, as well as survival.",
			},
			{
				name: "Sorcery",
				description: "The act of mana manipulation to various means.",
			},
			{
				name: "Taboo",
				description: "Demons, curses, and other such occultic matters.",
			},
			{
				name: "Tech",
				description: "Mechanical contraptions and architecture.",
			},
		],
	}),
]
