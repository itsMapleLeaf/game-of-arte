import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	users: defineTable({
		tokenIdentifier: v.string(),
		discordUserId: v.string(),
		name: v.string(),
	})
		.index("by_token_identifier", ["tokenIdentifier"])
		.index("by_discord_user_id", ["discordUserId"]),
	characters: defineTable({
		name: v.string(),
		sheetValues: v.array(
			v.object({
				key: v.string(),
				value: v.union(v.string(), v.number()),
			}),
		),
	}),
})
