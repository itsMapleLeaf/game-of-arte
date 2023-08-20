import { mutation, query } from "convex/_generated/server"
import { v, type Validator } from "convex/values"
import randimals from "randimals"
import * as vb from "valibot"
import { type Doc } from "./_generated/dataModel"
import { requireAdmin, requirePlayer } from "./auth"

export const list = query({
	handler: async (ctx) => {
		const characters = await ctx.db.query("characters").collect()
		return characters.map(parseCharacter)
	},
})

export const get = query({
	args: { id: v.id("characters") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id)
	},
})

export const create = mutation({
	args: { name: v.optional(v.string()) },
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		const id = await ctx.db.insert("characters", {
			name: args.name ?? randimals(),
			data: {},
		})
		return { id }
	},
})

export const update = mutation({
	args: { id: v.id("characters"), name: v.string() },
	handler: async (ctx, args) => {
		await requirePlayer(ctx)
		await ctx.db.patch(args.id, { name: args.name })
	},
})

export const updateData = mutation({
	args: {
		id: v.id("characters"),
		data: v.any() as Validator<Record<string, string | number>>,
	},
	handler: async (ctx, args) => {
		await requirePlayer(ctx)

		const doc = await ctx.db.get(args.id)
		if (!doc) {
			throw new Error(`Character not found: ${args.id}`)
		}

		const character = parseCharacter(doc)

		await ctx.db.patch(args.id, {
			data: {
				...character.data,
				...args.data,
			},
		})
	},
})

export const remove = mutation({
	args: { id: v.id("characters") },
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		await ctx.db.delete(args.id)
	},
})

const characterDataSchema = vb.record(vb.union([vb.string(), vb.number()]))

export type Character = ReturnType<typeof parseCharacter>
function parseCharacter(doc: Doc<"characters">) {
	return {
		...doc,
		data: characterDataSchema.parse(doc.data),
	}
}
