import type { PaginationResult } from "convex/server"
import { v } from "convex/values"
import type { Doc } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server.js"
import { type Die, diceRuleValidator } from "./diceRolls.validators.ts"
import { requireAdmin, requirePlayerUser } from "./roles.ts"
import { nullish } from "./validators.ts"

export type DiceRollListItem = Omit<Doc<"diceRolls">, "discordUserId"> & {
	initiatorName: string | undefined
}

const maxRolls = 250

export const list = query({
	args: {
		limit: v.optional(v.number()),
		cursor: nullish(v.string()),
	},
	handler: async (ctx, args): Promise<PaginationResult<DiceRollListItem>> => {
		const result = await ctx.db
			.query("diceRolls")
			.order("desc")
			.paginate({
				numItems: args.limit ?? maxRolls,
				cursor: args.cursor ?? null,
			})

		const discordUserIds = [...new Set(result.page.map((r) => r.discordUserId))]

		const users = await ctx.db
			.query("users")
			.filter((q) =>
				q.or(...discordUserIds.map((id) => q.eq(q.field("discordUserId"), id))),
			)
			.collect()

		const usersById = new Map(users.map((u) => [u.discordUserId, u]))

		return {
			...result,
			page: result.page.map(({ discordUserId, ...roll }) => ({
				...roll,
				initiatorName: usersById.get(discordUserId)?.name,
			})),
		}
	},
})

export const roll = mutation({
	args: {
		type: v.optional(v.literal("action")),
		label: v.optional(v.string()),
		characterId: v.optional(v.id("characters")),
		dice: v.array(
			v.object({
				sides: v.number(),
				count: v.number(),
				rules: v.optional(v.array(diceRuleValidator)),
			}),
		),
	},
	handler: async (ctx, { dice, ...data }) => {
		const user = await requirePlayerUser(ctx)

		const rolls: Die[] = []
		for (const diceInput of dice) {
			for (let i = 0; i < diceInput.count; i++) {
				const result = Math.floor(Math.random() * diceInput.sides) + 1

				const { range: _, ...props } =
					diceInput.rules?.find(
						(rule) =>
							rule.range == null ||
							(result >= (rule.range.min ?? 1) &&
								result <= (rule.range.max ?? diceInput.sides)),
					) ?? {}

				rolls.push({
					...props,
					sides: diceInput.sides,
					result,
				})
			}
		}

		const id = await ctx.db.insert("diceRolls", {
			...data,
			discordUserId: user.discordUserId,
			dice: rolls,
		})

		const allRolls = await ctx.db.query("diceRolls").collect()
		const excessRolls = allRolls.slice(0, -maxRolls)
		await Promise.all(excessRolls.map((r) => ctx.db.delete(r._id)))

		return { _id: id, dice: rolls }
	},
})

export const setHints = mutation({
	args: {
		rollId: v.id("diceRolls"),
		hints: v.array(v.string()),
	},
	handler: async (ctx, { rollId, hints }) => {
		await requirePlayerUser(ctx)

		const roll = await ctx.db.get(rollId)
		if (!roll) {
			throw new Error("Roll not found")
		}

		await ctx.db.patch(rollId, { hints })
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
