import { v } from "convex/values"

export const diceValidator = v.array(
	v.object({ sides: v.number(), result: v.number() }),
)
