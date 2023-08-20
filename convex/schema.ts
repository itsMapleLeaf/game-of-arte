import { defineSchema, defineTable } from "convex/server"
import { v, type Validator } from "convex/values"

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
	players: defineTable({
		discordUserId: v.string(),
	}).index("by_discord_user_id", ["discordUserId"]),
	characters: defineTable({
		name: v.string(),
		data: playerDataValidator(),
	}),
	diceRolls: defineTable({
		type: v.optional(v.string()),
		label: v.optional(v.string()),
		discordUserId: v.string(),
		characterId: v.optional(v.id("characters")),
		dice: diceSchema,
		resilienceCollected: v.optional(v.boolean()),
	}),
})
