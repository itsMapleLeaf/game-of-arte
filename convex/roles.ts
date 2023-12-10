import { type QueryCtx, query } from "./_generated/server.js"
import { getPlayerByUser } from "./players.ts"
import { getAuthenticatedUser } from "./users.ts"
import { getWorld } from "./world.ts"

export type Roles = {
	isAdmin: boolean
	isPlayer: boolean
	isSpectator: boolean
}

export const get = query({
	handler: async (ctx): Promise<Roles> => {
		const [isAdmin, isPlayer] = await Promise.all([
			hasAdminRole(ctx),
			hasPlayerRole(ctx),
		])
		return { isAdmin, isPlayer, isSpectator: !isPlayer }
	},
})

export async function hasAdminRole(ctx: QueryCtx) {
	const [user, world] = await Promise.all([
		getAuthenticatedUser(ctx),
		getWorld(ctx),
	])
	return user != null && world.ownerId === user._id
}

export async function requireAdminRole(ctx: QueryCtx) {
	if (!(await hasAdminRole(ctx))) {
		throw new Error("You must be an admin to perform this action.")
	}
}

export async function hasPlayerRole(ctx: QueryCtx) {
	const [isAdmin, user] = await Promise.all([
		hasAdminRole(ctx),
		getAuthenticatedUser(ctx),
	])

	if (isAdmin) {
		return true
	}

	const player = user && (await getPlayerByUser(ctx, user))
	return player != null
}

export async function requirePlayerRole(ctx: QueryCtx) {
	if (!(await hasPlayerRole(ctx))) {
		throw new Error("You must be a player to perform this action.")
	}
}
