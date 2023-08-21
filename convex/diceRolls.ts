import { v } from "convex/values"
import { toFiniteNumberOrUndefined } from "../src/helpers/index.ts"
import { type Doc } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server.js"
import { requireAdmin, requirePlayerUser } from "./roles.ts"

export type DiceRollListItem = Omit<Doc<"diceRolls">, "discordUserId"> & {
	initiatorName: string | undefined
}

export const list = query({
	handler: async (ctx): Promise<DiceRollListItem[]> => {
		const rolls = await ctx.db.query("diceRolls").order("desc").take(100)
		const discordUserIds = [...new Set(rolls.map((r) => r.discordUserId))]

		const users = await ctx.db
			.query("users")
			.filter((q) =>
				q.or(...discordUserIds.map((id) => q.eq(q.field("discordUserId"), id))),
			)
			.collect()

		const usersById = new Map(users.map((u) => [u.discordUserId, u]))

		return rolls.map(({ discordUserId, ...roll }) => ({
			...roll,
			initiatorName: usersById.get(discordUserId)?.name,
		}))
	},
})

export const roll = mutation({
	args: {
		type: v.optional(v.string()),
		label: v.optional(v.string()),
		characterId: v.optional(v.id("characters")),
		dice: v.array(v.object({ sides: v.number(), count: v.number() })),
	},
	handler: async (ctx, { dice, ...data }) => {
		const user = await requirePlayerUser(ctx)

		const rolls = []
		for (const dieItem of dice) {
			for (let i = 0; i < dieItem.count; i++) {
				rolls.push({
					sides: dieItem.sides,
					result: Math.floor(Math.random() * dieItem.sides) + 1,
				})
			}
		}

		await ctx.db.insert("diceRolls", {
			...data,
			discordUserId: user.discordUserId,
			dice: rolls,
		})
	},
})

export const collectResilience = mutation({
	args: {
		id: v.id("diceRolls"),
	},
	handler: async (ctx, args) => {
		await requirePlayerUser(ctx)

		const roll = await ctx.db.get(args.id)
		if (!roll) {
			throw new Error("Roll not found")
		}

		if (!roll.characterId) {
			throw new Error("Roll has no character")
		}

		if (roll.resilienceCollected) {
			throw new Error("Resilience already collected")
		}

		const character = await ctx.db.get(roll.characterId)
		if (!character) {
			throw new Error("Character not found")
		}

		await Promise.all([
			ctx.db.patch(args.id, { resilienceCollected: true }),
			ctx.db.patch(character._id, {
				data: {
					...character.data,
					resilience:
						(toFiniteNumberOrUndefined(character.data.resilience) ?? 2) + 1,
				},
			}),
		])
	},
})

export const remove = mutation({
	args: {
		id: v.id("diceRolls"),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		await ctx.db.delete(args.id)
	},
})
