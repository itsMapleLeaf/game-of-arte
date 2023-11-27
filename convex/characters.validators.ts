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
