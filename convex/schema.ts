import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import {
	conditionValidator,
	sorceryDeviceValidator,
	sorcerySpellValidator,
} from "./characters.validators.ts"
import { dieValidator } from "./diceRolls.validators.ts"
import { record } from "./validators.ts"

export default defineSchema({
	users: defineTable({
		tokenIdentifier: v.string(),
		discordUserId: v.optional(v.string()),
		name: v.string(),
	})
		.index("by_token_identifier", ["tokenIdentifier"])
		.index("by_discord_user_id", ["discordUserId"]),

	worlds: defineTable({
		ownerId: v.optional(v.id("users")),
		experience: v.number(),
		mana: v.optional(v.number()),
	}),

	players: defineTable({
		discordUserId: v.string(),
		ownedCharacterId: v.optional(v.id("characters")),
	}).index("by_discord_user_id", ["discordUserId"]),

	players_v2: defineTable({
		userTokenIdentifier: v.string(),
		assignedCharacterId: v.optional(v.id("characters")),
	})
		.index("by_user_token_identifier", ["userTokenIdentifier"])
		.index("by_assigned_character_id", ["assignedCharacterId"]),

	invites: defineTable({}),

	characters: defineTable({
		name: v.string(),
		hidden: v.optional(v.boolean()),
		data: record<string | number>(),
		conditions: v.optional(v.array(conditionValidator)),
		sorceryDevice: v.optional(sorceryDeviceValidator),
		freeformSpells: v.optional(v.array(sorcerySpellValidator)),
	}),

	diceRolls: defineTable({
		label: v.optional(v.string()),
		userId: v.optional(v.id("users")),
		discordUserId: v.optional(v.string()),
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
