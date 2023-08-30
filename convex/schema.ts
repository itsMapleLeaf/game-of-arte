import { defineSchema, defineTable } from "convex/server"
import { type Validator, v } from "convex/values"

export const nullish = <T>(validator: Validator<T>) =>
	v.optional(v.union(validator, v.null()))

export const playerDataValidator = () =>
	v.any() as Validator<Record<string, string | number>>

export const diceSchema = v.array(
	v.object({ sides: v.number(), result: v.number() }),
)

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
		data: playerDataValidator(),
	}),

	diceRolls: defineTable({
		type: v.optional(v.literal("action")),
		label: v.optional(v.string()),
		discordUserId: v.string(),
		characterId: v.optional(v.id("characters")),
		dice: diceSchema,
		resilienceCollected: v.optional(v.boolean()),
	}),

	clocks: defineTable({
		name: v.string(),
		value: v.number(),
		maxValue: v.number(),
	}),
})
