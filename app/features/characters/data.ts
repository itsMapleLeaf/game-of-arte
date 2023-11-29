import type { Doc } from "convex/_generated/dataModel.js"
import * as v from "valibot"
import { clamp, sum } from "~/helpers/math.ts"
import type { AttributeCategoryId, AttributeId } from "./attributes.ts"
import {
	ATTRIBUTE_DEFAULT,
	ATTRIBUTE_MAX,
	ATTRIBUTE_MIN,
	RESILIENCE_DEFAULT,
	RESILIENCE_MIN,
} from "./constants.ts"

export function toCharacterDataNumberValue(
	input: unknown,
	{ min = -Infinity, max = Infinity } = {},
) {
	const number = Number(input)
	if (!Number.isFinite(number)) return undefined
	return clamp(Math.round(number), min, max)
}

function toAttributeValue(input: unknown) {
	return (
		toCharacterDataNumberValue(input, {
			min: ATTRIBUTE_MIN,
			max: ATTRIBUTE_MAX,
		}) ?? ATTRIBUTE_DEFAULT
	)
}

export type CharacterData = v.Output<typeof characterDataSchema>
const characterDataSchema = v.object({
	resilience: v.transform(
		v.unknown(),
		(input) =>
			toCharacterDataNumberValue(input, {
				min: RESILIENCE_MIN,
			}) ?? RESILIENCE_DEFAULT,
	),

	archetype: v.fallback(
		v.optional(
			v.picklist<
				AttributeCategoryId,
				[AttributeCategoryId, ...AttributeCategoryId[]]
			>(["physical", "mental", "social", "knowledge"]),
		),
		undefined,
	),

	pronouns: v.optional(v.string()),
	image: v.optional(v.string()),
	notes: v.optional(v.string()),
	inventory: v.optional(v.string()),
	background: v.optional(v.string()),
})

export function parseCharacterData(data: Record<string, string | number>) {
	return v.parse(characterDataSchema, data)
}

export function getCharacterAttributeValue(
	character: Doc<"characters">,
	attributeId: AttributeId,
) {
	return toAttributeValue(character.data[attributeId])
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