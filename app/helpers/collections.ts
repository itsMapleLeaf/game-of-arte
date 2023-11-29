import type { SafeArrayIndex } from "./types.ts"

export function groupBy<Item, Group>(
	items: Iterable<Item>,
	getGroup: (item: Item) => Group,
) {
	const groups = new Map<Group, Item[]>()
	for (const item of items) {
		const name = getGroup(item)
		const items = groups.get(name) ?? []
		items.push(item)
		groups.set(name, items)
	}
	return groups
}

export function randomItem<Items extends readonly unknown[]>(
	items: Items,
): SafeArrayIndex<Items> {
	return items[Math.floor(Math.random() * items.length)]
}

export function compareKey<K extends PropertyKey>(key: K) {
	return function compare(a: Record<K, string>, b: Record<K, string>) {
		return a[key].localeCompare(b[key])
	}
}
