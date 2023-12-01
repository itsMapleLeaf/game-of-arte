import type { Doc } from "convex/_generated/dataModel.js"
import * as z from "zod"
import { clamp, sum } from "~/helpers/math.ts"
import type { AttributeId } from "./attributes.ts"
import {
	ATTRIBUTE_DEFAULT,
	ATTRIBUTE_MAX,
	ATTRIBUTE_MIN,
	RESILIENCE_DEFAULT,
	RESILIENCE_MIN,
} from "./constants.ts"

export type CharacterDataInput = Partial<
	Record<keyof CharacterData, string | number>
>
export type CharacterData = z.output<typeof characterDataSchema>
const characterDataSchema = z.object({
	resilience: z.coerce
		.number()
		.int()
		.min(RESILIENCE_MIN)
		.catch(RESILIENCE_DEFAULT),

	archetype: z
		.enum(["physical", "mental", "social", "knowledge"])
		.optional()
		.catch(undefined),

	pronouns: z.string().catch(""),
	image: z.string().catch(""),
	notes: z.string().catch(""),
	inventory: z.string().catch(""),
	background: z.string().catch(""),
})

export function parseCharacterData(data: Record<string, string | number>) {
	return characterDataSchema.parse(data)
}

function toCharacterDataNumberValue(
	input: unknown,
	{ min = -Infinity, max = Infinity } = {},
) {
	const number = Number(input)
	if (!Number.isFinite(number)) return undefined
	return clamp(Math.round(number), min, max)
}

export function getCharacterAttributeValue(
	character: Doc<"characters">,
	attributeId: AttributeId,
) {
	return (
		toCharacterDataNumberValue(character.data[attributeId], {
			min: ATTRIBUTE_MIN,
			max: ATTRIBUTE_MAX,
		}) ?? ATTRIBUTE_DEFAULT
	)
}

export function getCharacterStress(character: Doc<"characters">) {
	const physicalStress = sum(
		character.conditions?.map((c) => c.physicalStress) ?? [],
	)
	const mentalStress = sum(
		character.conditions?.map((c) => c.mentalStress) ?? [],
	)
	return { physicalStress, mentalStress }
}
