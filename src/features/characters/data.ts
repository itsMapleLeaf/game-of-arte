import * as v from "valibot"
import { clamp } from "~/helpers/math.ts"
import {
	ATTRIBUTE_DEFAULT,
	ATTRIBUTE_MAX,
	ATTRIBUTE_MIN,
	RESILIENCE_DEFAULT,
	RESILIENCE_MIN,
	STRESS_DEFAULT,
	STRESS_MAX,
	STRESS_MIN,
} from "./constants.ts"

const toCharacterDataValue =
	({ min = 0, max = Infinity, fallback = 0 } = {}) =>
	(input: unknown) => {
		const number = Number(input)
		return Number.isFinite(number) ?
				clamp(Math.round(number), min, max)
			:	fallback
	}

const attributeValueSchema = v.transform(
	v.unknown(),
	toCharacterDataValue({
		min: ATTRIBUTE_MIN,
		max: ATTRIBUTE_MAX,
		fallback: ATTRIBUTE_DEFAULT,
	}),
)

export type CharacterData = v.Output<typeof characterDataSchema>
const characterDataSchema = v.object({
	agility: attributeValueSchema,
	endurance: attributeValueSchema,
	stealth: attributeValueSchema,
	strength: attributeValueSchema,

	dexterity: attributeValueSchema,
	resolve: attributeValueSchema,
	intuition: attributeValueSchema,
	perception: attributeValueSchema,

	charm: attributeValueSchema,
	deception: attributeValueSchema,
	intimidation: attributeValueSchema,
	insight: attributeValueSchema,
	persuasion: attributeValueSchema,
	performance: attributeValueSchema,
	comfort: attributeValueSchema,

	sorcery: attributeValueSchema,
	alchemy: attributeValueSchema,
	astronomy: attributeValueSchema,
	world: attributeValueSchema,
	nature: attributeValueSchema,
	taboo: attributeValueSchema,
	tech: attributeValueSchema,

	resilience: v.transform(
		v.unknown(),
		toCharacterDataValue({
			min: RESILIENCE_MIN,
			fallback: RESILIENCE_DEFAULT,
		}),
	),

	mentalStress: v.transform(
		v.unknown(),
		toCharacterDataValue({
			min: STRESS_MIN,
			max: STRESS_MAX,
			fallback: STRESS_DEFAULT,
		}),
	),

	physicalStress: v.transform(
		v.unknown(),
		toCharacterDataValue({
			min: STRESS_MIN,
			max: STRESS_MAX,
			fallback: STRESS_DEFAULT,
		}),
	),

	archetype: v.fallback(
		v.nullish(v.picklist(["athlete", "strategist", "empath", "scholar"])),
		undefined,
	),
})

export function parseCharacterData(data: Record<string, string | number>) {
	return v.parse(characterDataSchema, data)
}
