import {
	type AttributeId,
	getAttributeById,
	getAttributeCategories,
	getAttributeCategoryById,
	getAttributes,
} from "~/features/characters/attributes"
import { randomItem } from "~/helpers/collections.ts"
import { expect } from "~/helpers/expect.ts"
import { sum } from "~/helpers/math.ts"
import { randomItemWeighted } from "./CharacterDetails.tsx"
import { ATTRIBUTE_MAX, ATTRIBUTE_MIN } from "./constants.ts"

export function generateRandomStats(experience: number) {
	const stats = Object.fromEntries(
		getAttributes().map((attribute) => [attribute.id, 1]),
	)

	for (let i = 0; i < experience; i++) {
		const category = randomItemWeighted([
			[getAttributeCategoryById("physical"), 1],
			[getAttributeCategoryById("mental"), 1],
			[getAttributeCategoryById("social"), 1],
			[getAttributeCategoryById("knowledge"), 0.5],
		])

		const attribute = expect(randomItem(category.attributes))

		// if the attribute is already at 5, try again
		if (stats[attribute.id] === 5) {
			i -= 1
			continue
		}

		stats[attribute.id] += 1
	}

	const archetype = expect(
		randomItem(getAttributeCategories().map((category) => category.id)),
	)

	return { stats, archetype }
}

if (import.meta.vitest) {
	const v = import.meta.vitest

	v.describe("generateRandomStats", () => {
		v.it("should generate random stats and a random archetype", () => {
			// run this multiple times times for good measure
			for (let i = 0; i < 100; i++) {
				const experience = 10
				const { stats, archetype } = generateRandomStats(experience)

				v.expect(Object.keys(stats)).toHaveLength(getAttributes().length)

				v.expect(sum(Object.values(stats))).toBe(
					getAttributes().length + experience,
				)

				for (const [key, value] of Object.entries(stats)) {
					v.expectTypeOf(getAttributeById(key as AttributeId)).toBeObject()
					v.expectTypeOf(value).toBeNumber()
					v.expect(value).toBeGreaterThanOrEqual(ATTRIBUTE_MIN)
					v.expect(value).toBeLessThanOrEqual(ATTRIBUTE_MAX)
				}

				v.assert.include(
					getAttributeCategories().map((c) => c.id),
					archetype,
				)
			}
		})
	})
}
