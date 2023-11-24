export function setRemove<Item>(
	set: ReadonlySet<Item>,
	value: Item,
): ReadonlySet<Item> {
	const newSet = new Set(set)
	newSet.delete(value)
	return newSet
}
