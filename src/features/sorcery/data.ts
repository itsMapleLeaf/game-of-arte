export interface SorcerySpell {
	name: string
	description: string
	cost: { mana: number; mentalStress?: number }
	castingTime?: { turns: number }
	amplifiedDescription: string
	drawbacks?: string[]
}
export type SorcerySpellId = string

export const sorcerySpells: Record<SorcerySpellId, SorcerySpell> = {
	befriend: {
		name: "Befriend",
		description: `Form a long-term friendly pact with a non-sentient being`,
		amplifiedDescription: `Multiple beings`,
		cost: { mana: 5, mentalStress: 2 },
		castingTime: { turns: 2 },
		drawbacks: [
			`The target may become more hostile towards you`,
			`The target may choose to befriend someone else`,
		],
	},
	burning: {
		name: "Burning",
		description: `Create a flame in your hands with the size of a baseball`,
		amplifiedDescription: `No size limit`,
		cost: { mana: 2 },
		drawbacks: [`You get burnt`],
	},
	// counter: {
	// 	name: "Counter",
	// 	description: `Prevent the effect of another spell`,
	// 	amplifiedDescription: `Repeat the spell and modify it as if you casted it yourself`,
	// 	cost: { mana: "variable" },
	// 	drawbacks: [`The spell doesn’t get cancelled, but altered in some way`],
	// },
	frost: {
		name: "Frost",
		description: `Accumulate water in the area and form it into an ice structure with the mass of a baseball`,
		amplifiedDescription: `No size limit`,
		cost: { mana: 2 },
		drawbacks: [`You get frostbite`],
	},
	gateway: {
		name: "Gateway",
		description: `Create a human-sized portal from one nearby location to another, at a max distance of 10 meters from yourself. This portal remains open for as long as the caster chooses, for a max of 5 minutes.`,
		amplifiedDescription: `Create portals anywhere`,
		cost: { mana: 4 },
		castingTime: { turns: 2 },
		drawbacks: [`The portals may appear in the wrong place`],
	},
	healing: {
		name: "Healing",
		description: `With X successes, remove X ticks of stress from a target`,
		amplifiedDescription: `Remove all ticks from multiple targets`,
		cost: { mana: 2 },
		castingTime: { turns: 1 },
		drawbacks: [`Some stinging may occur`],
	},
	identify: {
		name: "Identify",
		description: `Gain insight into the properties of a target`,
		amplifiedDescription: `Multiple targets`,
		cost: { mana: 3 },
		castingTime: { turns: 2 },
		drawbacks: [`You may receive incorrect information`],
	},
	illusion: {
		name: "Illusion",
		description: `Fiddle with the senses of a sentient target to make them see, hear, or otherwise sense things that aren’t there.`,
		amplifiedDescription: `Multiple targets`,
		cost: { mana: 4 },
		drawbacks: [`The caster may experience the illusion themselves`],
	},
	imbue: {
		name: "Imbue",
		description: `Imbue one tick worth of mana into an object, with varying effects depending on the object`,
		amplifiedDescription: `Spend X mana to imbue that much mana`,
		cost: { mana: 1 },
		castingTime: { turns: 1 },
		drawbacks: [`Essential mana may be used instead of excess mana`],
	},
	lifesteal: {
		name: "Lifesteal",
		description: `With an X success count, apply that much stress to a target and heal that much stress`,
		amplifiedDescription: `Multiple targets`,
		cost: { mana: 4 },
		drawbacks: [],
	},
	manaRay: {
		name: "Mana Ray",
		description: `Condense mana into a single baseball-size projectile and propel it`,
		amplifiedDescription: `Multiple projectiles`,
		cost: { mana: 2 },
		drawbacks: [`The projectile might fire in the wrong direction`],
	},
	message: {
		name: "Message",
		description: `Project the image and sound of yourself to another subject for ten seconds after you begin speaking`,
		amplifiedDescription: `No duration limit`,
		cost: { mana: 3 },
		drawbacks: [`The message won’t come through very clearly`],
	},
	modifyMemory: {
		name: "Modify Memory",
		description: `Selectively change or erase a subject’s memory of a specific topic`,
		amplifiedDescription: `Modify memories without limits`,
		cost: { mana: 5, mentalStress: 3 },
		castingTime: { turns: 1 },
		drawbacks: [
			`The subject receives excessive stress`,
			`More than what was intended may be erased`,
		],
	},
	move: {
		name: "Move",
		description: `Precisely manipulate an object’s position, no higher than a human-mass`,
		amplifiedDescription: `No mass limit`,
		cost: { mana: 3 },
		drawbacks: [`The object may move in ways you didn’t intend`],
	},
	propel: {
		name: "Propel",
		description: `Apply an impulse to an object lighter than a human-mass`,
		amplifiedDescription: `No mass limit`,
		cost: { mana: 3 },
		drawbacks: [
			`The object may fly in a different direction than you intended`,
			`The object’s velocity may differ from what you intended`,
		],
	},
	rangedFist: {
		name: "Ranged Fist",
		description: `Collect mana into the solid form of a fist and control it from 10 meters away`,
		amplifiedDescription: `No distance limit`,
		cost: { mana: 2 },
		drawbacks: [`The fist may act in ways you didn’t intend`],
	},
	readThoughts: {
		name: "Read Thoughts",
		description: `Read the surface-level thoughts of a person in front of you.`,
		amplifiedDescription: `Read deeper thoughts & long term memories`,
		cost: { mana: 4, mentalStress: 1 },
		drawbacks: [
			`You may receive additional stress`,
			`The subject may receive stress`,
		],
	},
	regravitate: {
		name: "Regravitate",
		description: `Half or double the force of gravity in an area of your choice until your next spell`,
		amplifiedDescription: `No gravity limit (can’t go negative)`,
		cost: { mana: 2 },
		drawbacks: [`Gravity may differ from what was intended`],
	},
	strengthen: {
		name: "Strengthen",
		description: `Until your next spell, give a target +1 to your choice of Physical, Mental, or Social rolls`,
		amplifiedDescription: `+2 OR multiple targets`,
		cost: { mana: 2 },
		drawbacks: [
			`Another attribute may be strengthened instead`,
			`The target may be weakened instead`,
		],
	},
	summon: {
		name: "Summon",
		description: `Summon a being from another dimension`,
		amplifiedDescription: `Summon multiple beings`,
		cost: { mana: 4, mentalStress: 1 },
		castingTime: { turns: 1 },
		drawbacks: [
			`You summoned something else`,
			`You may receive additional stress`,
			`The summoned being may receive stress`,
		],
	},
	teleport: {
		name: "Teleport",
		description: `Instantaneously move to another location within line of sight`,
		amplifiedDescription: `Move multiple targets`,
		cost: { mana: 4 },
		drawbacks: [
			`Your end location may differ`,
			`You may carry some additional momentum on landing`,
		],
	},
	weaken: {
		name: "Weaken",
		description: `Apply 2 mental or physical stress to a target`,
		amplifiedDescription: `Apply 4 stress OR multiple targets, +1 mana per extra target`,
		cost: { mana: 4, mentalStress: 1 },
		drawbacks: [
			`You may strengthen the target instead`,
			`You may weaken a different attribute than intended`,
		],
	},
}
