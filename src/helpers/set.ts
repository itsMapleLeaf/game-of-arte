export function setRemove<Item>(
	set: ReadonlySet<Item>,
	value: Item,
): ReadonlySet<Item> {
	const newSet = new Set(set)
	newSet.delete(value)
	return newSet
}

export function setToggle<Item>(
	set: ReadonlySet<Item>,
	value: Item,
): ReadonlySet<Item> {
	if (set.has(value)) {
		return setRemove(set, value)
	} else {
		return new Set(set).add(value)
	}
}

export function mapSet(
	set: ReadonlySet<string>,
	fn: (value: string) => string,
): ReadonlySet<string> {
	const newSet = new Set<string>()
	for (const value of set) {
		newSet.add(fn(value))
	}
	return newSet
}
