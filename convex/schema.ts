import { defineSchema, defineTable } from "convex/server"
import { v, type Validator } from "convex/values"

export const playerDataValidator = () =>
	v.any() as Validator<Record<string, string | number>>

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
})
