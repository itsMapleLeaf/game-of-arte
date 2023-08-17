export type SheetFieldBase = {
	id: string
	label: string
	description?: string
}

export type SheetField =
	| (SheetFieldBase & { type: "text" })
	| (SheetFieldBase & { type: "image" })
	| (SheetFieldBase & { type: "counter"; default?: number })
	| (SheetFieldBase & { type: "clock"; default?: number; max: number })
	| (SheetFieldBase & { type: "skill" })

export type SheetRow = {
	columns: SheetColumn[]
}

export type SheetColumn = {
	id: string
	fields: SheetField[]
}

export const characterSheetLayout: SheetRow[] = [
	{
		columns: [
			{
				id: "info",
				fields: [
					{ id: "appearance", label: "Appearance", type: "image" },
					{ id: "pronouns", label: "Pronouns", type: "text" },
					{ id: "background", label: "Background", type: "text" },
					{ id: "notes", label: "Notes", type: "text" },
				],
			},
			{
				id: "status",
				fields: [
					{
						id: "resilience",
						label: "Resilience",
						type: "counter",
						default: 2,
					},
					{
						id: "physicalStress",
						label: "Physical Stress",
						type: "clock",
						max: 6,
					},
					{
						id: "mentalStress",
						label: "Mental Stress",
						type: "clock",
						max: 6,
					},
					{ id: "condition", label: "Condition", type: "text" },
				],
			},
		],
	},
	{
		columns: [
			{
				id: "physical",
				fields: [
					{
						id: "agility",
						label: "Agility",
						description: "Staying quick and nimble on your feet.",
						type: "skill",
					},
					{
						id: "endurance",
						label: "Endurance",
						description: "Withstand external or internal forces or ailments.",
						type: "skill",
					},
					{
						id: "stealth",
						label: "Stealth",
						description: "Operating quietly, avoiding detection.",
						type: "skill",
					},
					{
						id: "strength",
						label: "Strength",
						description:
							"Solving problems with raw physical prowess and brute force.",
						type: "skill",
					},
				],
			},
			{
				id: "mental",
				fields: [
					{
						id: "dexterity",
						label: "Dexterity",
						description:
							"Doing tasks that require great precision and/or attention to detail.",
						type: "skill",
					},
					{
						id: "focus",
						label: "Focus",
						description: "Avoiding distraction or possession.",
						type: "skill",
					},
					{
						id: "intuition",
						label: "Intuition",
						description:
							"Using logic and reason, solving puzzles, mentally connecting the dots.",
						type: "skill",
					},
					{
						id: "perception",
						label: "Perception",
						description:
							"Seeing, hearing, or otherwise detecting the presence of things.",
						type: "skill",
					},
				],
			},
			{
				id: "social",
				fields: [
					{
						id: "charm",
						label: "Charm",
						description:
							"Getting on someone’s good side with flattery, seduction, or good looks.",
						type: "skill",
					},
					{
						id: "deception",
						label: "Deception",
						description:
							"Lying through a situation, either directly or by withholding information.",
						type: "skill",
					},
					{
						id: "intimidation",
						label: "Intimidation",
						description: "Influencing someone with a threatening presence.",
						type: "skill",
					},
					{
						id: "insight",
						label: "Insight",
						description:
							"Gleaning the true thoughts or intentions of a person or creature through their language and mannerisms.",
						type: "skill",
					},
					{
						id: "persuasion",
						label: "Persuasion",
						description: "Influencing someone with reason.",
						type: "skill",
					},
					{
						id: "performance",
						label: "Performance",
						description:
							"Captivating others with a charismatic aura that demands attention.",
						type: "skill",
					},
					{
						id: "comfort",
						label: "Comfort",
						description: "Calming others with a gentle aura.",
						type: "skill",
					},
				],
			},
			{
				id: "knowledge",
				fields: [
					{
						id: "alchemy",
						label: "Alchemy",
						description:
							"Material synthesis and the handling of ingredients to that end.",
						type: "skill",
					},
					{
						id: "astronomy",
						label: "Astronomy",
						description: "Celestial bodies and the mysterious ways they work.",
						type: "skill",
					},
					{
						id: "nature",
						label: "Nature",
						description:
							"Plants, creatures, weather, and other natural terrestrial subjects, as well as survival.",
						type: "skill",
					},
					{
						id: "sorcery",
						label: "Sorcery",
						description: "The act of mana manipulation to various means.",
						type: "skill",
					},
					{
						id: "taboo",
						label: "Taboo",
						description: "Spirits, demons, and curses.",
						type: "skill",
					},
					{
						id: "tech",
						label: "Tech",
						description: "Mechanical contraptions and architecture.",
						type: "skill",
					},
				],
			},
		],
	},
]
