import { writable } from "svelte/store"

export function setStore<T>() {
	const store = writable(new Set<T>())
	return {
		subscribe: store.subscribe,
		add(value: T) {
			store.update((set) => new Set(set.add(value)))
		},
		remove(value: T) {
			return store.update((set) => {
				set.delete(value)
				return new Set(set)
			})
		},
		set(values: Iterable<T>) {
			store.set(new Set(values))
		},
		toggle(value: T) {
			store.update((set) => {
				if (set.has(value)) {
					set.delete(value)
				} else {
					set.add(value)
				}
				return new Set(set)
			})
		},
		clear() {
			store.set(new Set())
		},
	}
}
