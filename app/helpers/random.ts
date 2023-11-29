import type { SafeArrayIndex } from "./types.ts"

export function randomItemWeighted<
	Items extends readonly (readonly [item: unknown, weight: number])[],
>(items: Items): Items[number][0] {
	const totalWeight = items.reduce((sum, [, weight]) => sum + weight, 0)

	const itemsWithDistributions: [Items[number][0], number][] = []
	let currentDistribution = 0
	for (const [item, weight] of items) {
		currentDistribution += weight / totalWeight
		itemsWithDistributions.push([item, currentDistribution])
	}

	const randomValue = Math.random()
	return itemsWithDistributions.find(([, weight]) => randomValue < weight)?.[0]
}

export function randomItem<Items extends readonly unknown[]>(
	items: Items,
): SafeArrayIndex<Items> {
	return items[Math.floor(Math.random() * items.length)]
}
