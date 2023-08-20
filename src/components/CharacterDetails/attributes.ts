export type CharacterAttributeColumn = {
	title: string
	attributes: Array<string | { name: string; dataKey: string }>
}

export const attributes: CharacterAttributeColumn[] = [
	{
		title: "Physical",
		attributes: ["Agility", "Endurance", "Stealth", "Strength"],
	},
	{
		title: "Mental",
		attributes: ["Dexterity", "Focus", "Intuition", "Perception"],
	},
	{
		title: "Social",
		attributes: [
			"Charm",
			"Deception",
			"Intimidation",
			"Insight",
			"Persuasion",
			"Performance",
			"Comfort",
		],
	},
	{
		title: "Knowledge",
		attributes: ["Alchemy", "Astronomy", "Nature", "Sorcery", "Taboo", "Tech"],
	},
]
