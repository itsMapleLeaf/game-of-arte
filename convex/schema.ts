import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import {
	conditionValidator,
	sorceryDeviceValidator,
} from "./characters.validators.ts"
import { dieValidator } from "./diceRolls.validators.ts"
import { record } from "./validators.ts"

export default defineSchema({
	users: defineTable({
		tokenIdentifier: v.string(),
		discordUserId: v.string(),
		name: v.string(),
	})
		.index("by_token_identifier", ["tokenIdentifier"])
		.index("by_discord_user_id", ["discordUserId"]),

	worlds: defineTable({
		experience: v.number(),
		mana: v.optional(v.number()),
	}),

	players: defineTable({
		discordUserId: v.string(),
		ownedCharacterId: v.optional(v.id("characters")),
	}).index("by_discord_user_id", ["discordUserId"]),

	characters: defineTable({
		name: v.string(),
		hidden: v.optional(v.boolean()),
		data: record<string | number>(),
		sorceryDevice: v.optional(sorceryDeviceValidator),
		conditions: v.optional(v.array(conditionValidator)),
	}),

	diceRolls: defineTable({
		label: v.optional(v.string()),
		discordUserId: v.string(),
		characterId: v.optional(v.id("characters")),
		dice: v.array(dieValidator),
		hints: v.optional(v.array(v.string())),
		secret: v.optional(v.boolean()),

		/** @deprecated */
		type: v.optional(v.literal("action")),
		/** @deprecated */
		resilienceCollected: v.optional(v.boolean()),
	}),

	clocks: defineTable({
		name: v.string(),
		value: v.number(),
		maxValue: v.number(),
	}),
})
