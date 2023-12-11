import { mutation } from "./_generated/server"

export const migratePlayersV2 = mutation({
	async handler(ctx) {
		for await (const { _id, _creationTime, ...player } of ctx.db.query(
			"players_v2",
		)) {
			ctx.db.insert("players", player)
		}
	},
})
