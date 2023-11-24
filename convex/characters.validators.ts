import { v } from "convex/values"

export const sorceryDeviceValidator = v.object({
	description: v.string(),
	spellAffinityIds: v.array(v.string()),
})
