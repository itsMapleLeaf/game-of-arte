import { compareKey } from "../../helpers/index.ts"
import { type PartialKeys } from "../../helpers/types.ts"

export type CharacterAttribute = {
	name: string
	description: string
	dataKey: string
}

export type CharacterAttributeColumn = {
	title: string
	attributes: CharacterAttribute[]
}

const setDefaultDataKey = (
	attribute: PartialKeys<CharacterAttribute, "dataKey">,
): CharacterAttribute => ({
	...attribute,
	dataKey: attribute.dataKey ?? attribute.name.toLowerCase(),
})

export const attributes: CharacterAttributeColumn[] = [
	{
		title: "Physical",
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
		]
			.map(setDefaultDataKey)
			.toSorted(compareKey("name")),
	},
	{
		title: "Mental",
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
		]
			.map(setDefaultDataKey)
			.toSorted(compareKey("name")),
	},
	{
		title: "Social",
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
		]
			.map(setDefaultDataKey)
			.toSorted(compareKey("name")),
	},
	{
		title: "Knowledge",
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
		]
			.map(setDefaultDataKey)
			.toSorted(compareKey("name")),
	},
]
