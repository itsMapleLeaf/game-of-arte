import { it } from "./iterable.ts"

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

export function compareKey<K extends PropertyKey>(key: K) {
	return function compare(a: Record<K, string>, b: Record<K, string>) {
		return a[key].localeCompare(b[key])
	}
}

export function upsertArray<Item>(
	items: Iterable<Item>,
	item: Item,
	key: keyof Item | ((item: Item) => unknown),
) {
	const getKey = typeof key === "function" ? key : (i: Item) => i[key]
	const itemsById = new Map(it(items).map((i) => [getKey(i), i]))
	itemsById.set(getKey(item), item)
	return [...itemsById.values()]
}
