import { type Infer, v } from "convex/values"

export const sorceryDeviceValidator = v.object({
	description: v.string(),
	affinities: v.union(
		v.null(),
		v.object({
			// no tuples! this is the closest we can get
			first: v.string(),
			second: v.string(),
			third: v.string(),
		}),
	),
})

export type Condition = Infer<typeof conditionValidator>
export const conditionValidator = v.object({
	id: v.string(),
	description: v.string(),
	physicalStress: v.number(),
	mentalStress: v.number(),
})

export type SorcerySpell = Infer<typeof sorcerySpellValidator>
export const sorcerySpellValidator = v.object({
	id: v.string(),
	name: v.string(),
	description: v.string(),
	amplifiedDescription: v.string(),
	attributeId: v.union(
		v.literal("nature"),
		v.literal("metaphysical"),
		v.literal("psychic"),
		v.literal("taboo"),
	),
	cost: v.object({
		mana: v.number(),
		mentalStress: v.optional(v.number()),
	}),
	castingTime: v.optional(v.object({ turns: v.number() })),
	drawbacks: v.optional(v.array(v.string())),
})
