import type { WithoutSystemFields } from "convex/server"
import { expect } from "~/helpers/expect.ts"
import type { Doc, TableNames } from "./_generated/dataModel"
import { type MutationCtx, mutation } from "./_generated/server"
import { convexEnv } from "./env.ts"
import { upsertUser } from "./users.ts"

export const seedCharacters = mutation({
	async handler(ctx) {
		requireTestEnv()
		await seedTable(ctx, "characters", [
			{
				conditions: [
					{
						description: "Sorcery - Modify Memory",
						id: "5788e8d1-7733-42c5-905f-109e350a779a",
						mentalStress: 4,
						physicalStress: 0,
					},
				],
				data: {
					Agility: 4,
					agility: 4,
					alchemy: "1",
					archetype: "social",
					background: `Eris lived a tough life pretty much all the way from her birth up until now. She never lived with a proper caretaker; most of her life involved scurrying on the streets alongside other poor kids in the darker side of Gatbury, making deals, thieving, and doing whatever else they needed to make end's meet.
			
		However, she always finds ways to smile through the toughest times, and this life gave her a treasure trove of street smarts, and she got good at escaping sticky situations, and/or bargaining her way through them.`,
					charm: 3,
					deception: 1,
					dexterity: 3,
					endurance: 2,
					focus: 2,
					image:
						"https://media.discordapp.net/attachments/1046832799853838416/1071531871554506812/eris.jpg",
					insight: 1,
					intuition: 2,
					inventory: "a knife",
					mentalStress: 2,
					nature: 1,
					notes: "",
					perception: 2,
					persuasion: 1,
					physicalStress: 0,
					pronouns: "she/her",
					psychic: 1,
					resilience: 3,
					resolve: 2,
					sorcery: 1,
					stealth: 3,
					strength: "1",
					taboo: 2,
					tech: 1,
					world: 1,
				},
				hidden: false,
				name: "Eris",
				sorceryDevice: {
					affinities: null,
					description: "A cool hat (important)",
				},
			},
			{
				conditions: [
					{
						description: ":)",
						id: "8efd10a8-57cc-45a9-8d17-28c661a9cf14",
						mentalStress: 3,
						physicalStress: 0,
					},
					{
						description: "everything",
						id: "c2420517-0557-4ca7-882b-88b1225a7234",
						mentalStress: 0,
						physicalStress: 3,
					},
				],
				data: {
					agility: 1,
					alchemy: 1,
					archetype: "social",
					background: `Is gay and likes to do magic`,
					charm: 3,
					deception: 2,
					dexterity: 3,
					endurance: 1,
					focus: 3,
					image: "",
					insight: 2,
					intuition: 2,
					inventory: [`A magician's outfit`, `A magic wand`].join("\n"),
					mentalStress: 3,
					perception: 2,
					performance: 5,
					persuasion: 1,
					physicalStress: 0,
					pronouns: "he/they",
					resilience: 4,
					stealth: 1,
					strength: 1,
					taboo: 3,
				},
				name: "Lyney",
			},
		])
	},
})

export const seedTestUser = mutation({
	async handler(ctx) {
		requireTestEnv()
		await seedTable(ctx, "users", [
			{
				name: "hellotest",
				tokenIdentifier: `${convexEnv.CLERK_JWT_ISSUER_DOMAIN}|${convexEnv.TEST_WORLD_OWNER_ID}`,
			},
		])
	},
})

export const seedWorld = mutation({
	async handler(ctx) {
		requireTestEnv()
		const ownerId = await upsertUser(ctx, {
			name: "hellotest",
			tokenIdentifier: `${convexEnv.CLERK_JWT_ISSUER_DOMAIN}|${convexEnv.TEST_WORLD_OWNER_ID}`,
		})
		await seedTable(ctx, "worlds", [
			{
				ownerId,
				experience: 8,
				mana: 12,
			},
		])
	},
})

export const seedPlayers = mutation({
	async handler(ctx) {
		requireTestEnv()
		const character = await ctx.db.query("characters").first()
		await seedTable(ctx, "players", [
			{
				userTokenIdentifier: `${convexEnv.CLERK_JWT_ISSUER_DOMAIN}|${convexEnv.TEST_WORLD_OWNER_ID}`,
				assignedCharacterId: expect(character)._id,
			},
		])
	},
})

export const removePlayers = mutation({
	async handler(ctx) {
		requireTestEnv()
		await seedTable(ctx, "players", [])
	},
})

export const removeInvites = mutation({
	async handler(ctx) {
		requireTestEnv()
		await seedTable(ctx, "invites", [])
	},
})
export const seedInvite = mutation({
	async handler(ctx) {
		requireTestEnv()
		await seedTable(ctx, "invites", [])
		return await ctx.db.insert("invites", {})
	},
})

async function seedTable<TableName extends TableNames>(
	ctx: MutationCtx,
	tableName: TableName,
	docs: Array<WithoutSystemFields<Doc<TableName>>>,
) {
	const existing = await ctx.db.query(tableName).collect()
	await Promise.all([
		...existing.map((doc) => ctx.db.delete(doc._id)),
		...docs.map((doc) => ctx.db.insert(tableName, doc)),
	])
}

function requireTestEnv() {
	if (convexEnv.TEST !== "true") {
		throw new Error("This mutation is only available in a test environment")
	}
}
