import { mutation } from "./_generated/server"

export const removeDiscordUserId = mutation({
	async handler(ctx) {
		for await (const user of ctx.db.query("users")) {
			await ctx.db.patch(user._id, { discordUserId: undefined })
		}
		for await (const roll of ctx.db.query("diceRolls")) {
			const { discordUserId } = roll
			let userId
			if (discordUserId) {
				const user = await ctx.db
					.query("users")
					.withIndex("by_discord_user_id", (q) =>
						q.eq("discordUserId", discordUserId),
					)
					.first()

				if (user) {
					userId = user._id
				}
			}
			await ctx.db.patch(roll._id, {
				userId,
				discordUserId: undefined,
			})
		}
	},
})
