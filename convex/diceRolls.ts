import type { PaginationResult } from "convex/server"
import { v } from "convex/values"
import { it } from "~/helpers/iterable.ts"
import type { Doc, Id } from "./_generated/dataModel"
import { type QueryCtx, mutation, query } from "./_generated/server.js"
import { type Die, diceRuleValidator } from "./diceRolls.validators.ts"
import {
	hasAdminRole,
	hasPlayerRole,
	requireAdminRole,
	requirePlayerRole,
} from "./roles.ts"
import { getAuthenticatedUser, requireAuthenticatedUser } from "./users.ts"
import { nullish } from "./validators.ts"

const maxRolls = 250

export const list = query({
	args: {
		limit: v.optional(v.number()),
		cursor: nullish(v.string()),
	},
	handler: async (ctx, args): Promise<PaginationResult<ClientDiceRoll>> => {
		const [result, user, isAdmin, isPlayer] = await Promise.all([
			getPaginatedRolls(ctx, args),
			getAuthenticatedUser(ctx),
			hasAdminRole(ctx),
			hasPlayerRole(ctx),
		])

		return {
			...result,
			page: result.page.map((roll) =>
				createClientDiceRoll({
					...roll,
					visible:
						isAdmin ||
						roll.secret !== true ||
						(roll.userId === user?._id && isPlayer),
				}),
			),
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
		secret: v.optional(v.boolean()),
	},
	handler: async (ctx, { dice, ...data }) => {
		const [user] = await Promise.all([
			requireAuthenticatedUser(ctx),
			requirePlayerRole(ctx),
		])

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
			userId: user._id,
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
		await requirePlayerRole(ctx)
		await ctx.db.patch(rollId, { hints })
	},
})

export const reveal = mutation({
	args: {
		rollId: v.id("diceRolls"),
	},
	handler: async (ctx, { rollId }) => {
		await requireRollPermissions(ctx, rollId)
		await ctx.db.patch(rollId, { secret: false })
	},
})

export const remove = mutation({
	args: {
		id: v.id("diceRolls"),
	},
	handler: async (ctx, args) => {
		await requireAdminRole(ctx)
		await ctx.db.delete(args.id)
	},
})

async function requireRoll(ctx: QueryCtx, id: Id<"diceRolls">) {
	const roll = await ctx.db.get(id)
	if (!roll) {
		throw new Error("Roll not found")
	}
	return roll
}

export type ClientDiceRoll = ReturnType<typeof createClientDiceRoll>
function createClientDiceRoll({
	userId: _userId,
	initiatorName,
	visible,
	...roll
}: Doc<"diceRolls"> & {
	initiatorName: string | undefined
	visible: boolean
}) {
	const clientRoll = {
		...roll,
		initiatorName,
	}

	if (visible) {
		return {
			...clientRoll,
			visible: true,
		} as const
	}

	return {
		...clientRoll,
		visible: false,
		dice: [],
		characterId: undefined,
		hints: [],
		label: undefined,
	} as const
}

async function requireRollPermissions(ctx: QueryCtx, rollId: Id<"diceRolls">) {
	const [roll, user, isAdmin, isPlayer] = await Promise.all([
		requireRoll(ctx, rollId),
		getAuthenticatedUser(ctx),
		hasAdminRole(ctx),
		hasPlayerRole(ctx),
	])
	return isAdmin || (roll.userId === user?._id && isPlayer)
}

async function getPaginatedRolls(
	ctx: QueryCtx,
	args: { limit?: number | undefined; cursor?: string | null | undefined },
) {
	const result = await ctx.db
		.query("diceRolls")
		.order("desc")
		.paginate({
			numItems: args.limit ?? maxRolls,
			cursor: args.cursor ?? null,
		})

	const users = await it(result.page)
		.map((roll) => roll.userId)
		.accept(Boolean)
		.unique()
		.map((id) => ctx.db.get(id))
		.promiseAll()

	const usersById = it(users)
		.accept(Boolean)
		.toMap((user) => [user._id, user])

	return {
		...result,
		page: result.page.map((roll) => ({
			...roll,
			initiatorName: roll.userId ? usersById.get(roll.userId)?.name : undefined,
		})),
	}
}
