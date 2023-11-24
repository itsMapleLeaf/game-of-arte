export function groupBy<Item, Group extends PropertyKey>(
	items: Iterable<Item>,
	getGroup: (item: Item) => Group,
) {
	const groups: Partial<Record<Group, Item[]>> = {}
	for (const item of items) {
		const name = getGroup(item)
		const items = groups[name] ?? []
		items.push(item)
		groups[name] = items
	}
	return groups
}
