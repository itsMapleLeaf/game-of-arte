import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { diceValidator } from "./diceRolls.validators.ts"
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
	}),

	players: defineTable({
		discordUserId: v.string(),
		ownedCharacterId: v.optional(v.id("characters")),
	}).index("by_discord_user_id", ["discordUserId"]),

	characters: defineTable({
		name: v.string(),
		hidden: v.optional(v.boolean()),
		data: record<string | number>(),
	}),

	diceRolls: defineTable({
		type: v.optional(v.literal("action")),
		label: v.optional(v.string()),
		discordUserId: v.string(),
		characterId: v.optional(v.id("characters")),
		dice: diceValidator,
		resilienceCollected: v.optional(v.boolean()),
	}),

	clocks: defineTable({
		name: v.string(),
		value: v.number(),
		maxValue: v.number(),
	}),
})
