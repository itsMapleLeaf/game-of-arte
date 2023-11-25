import { type Infer, v } from "convex/values"

export type DieColor = Infer<typeof dieColorValidator>
export const dieColorValidator = v.union(
	v.literal("positive"),
	v.literal("negative"),
	v.literal("critical"),
)

const dieProperties = {
	color: v.optional(dieColorValidator),
	face: v.optional(
		v.union(
			v.literal("number"),
			v.literal("blank"),
			v.literal("success"),
			v.literal("fail"),
		),
	),
	faceColor: v.optional(v.string()),
	successes: v.optional(v.number()),
	tooltip: v.optional(v.string()),
}

export type Die = Infer<typeof dieValidator>
export const dieValidator = v.object({
	sides: v.number(),
	result: v.number(),
	...dieProperties,
})

export type DiceRule = Infer<typeof diceRuleValidator>
export const diceRuleValidator = v.object({
	range: v.optional(
		v.object({
			min: v.optional(v.number()),
			max: v.optional(v.number()),
		}),
	),
	...dieProperties,
})
