interface GenericSorcerySpell {
	name: string
	description: string
	amplifyDescription: string
	cost: { mana: number; mentalStress?: number }
	castingTime?: { turns: number }
}

export type SorcerySpell = (typeof sorcerySpells)[keyof typeof sorcerySpells]
export type SorcerySpellId = (typeof sorcerySpellIds)[number]

export const sorcerySpells = {
	befriend: {
		name: "Befriend",
		description: "Form a long-term friendly pact with a non-sentient being",
		amplifyDescription: "Multiple beings",
		cost: { mana: 5, mentalStress: 2 },
		castingTime: { turns: 2 },
	},
	burning: {
		name: "Burning",
		description: "Small-scale control of fire and heat",
		amplifyDescription: "No scale limit",
		cost: { mana: 2 },
	},
	frost: {
		name: "Frost",
		description: "Small-scale control of ice and cold",
		amplifyDescription: "No scale limit",
		cost: { mana: 2 },
	},
} as const satisfies Record<string, GenericSorcerySpell>

export const sorcerySpellIds = Object.keys(
	sorcerySpells,
) as (keyof typeof sorcerySpells)[]
