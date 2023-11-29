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
