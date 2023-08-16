import { readonly, writable } from "svelte/store"

export type Character = {
	id: string
	name: string
	data: Record<string, string | number>
}

export const characterStore = (() => {
	const characters = writable<Character[]>([])

	function create() {
		const character: Character = {
			id: crypto.randomUUID(),
			name: "New Character",
			data: {},
		}
		characters.update((characters) => [...characters, character])
		return character
	}

	function update(id: string, data: Partial<Character>) {
		characters.update((characters) => {
			return characters.map((c) => {
				return c.id === id ? { ...c, ...data } : c
			})
		})
	}
	function updateData(id: string, data: Record<string, string | number>) {
		characters.update((characters) => {
			return characters.map((c) => {
				return c.id === id ? { ...c, data: { ...c.data, ...data } } : c
			})
		})
	}

	function remove(id: string) {
		characters.update((characters) => {
			return characters.filter((c) => c.id !== id)
		})
	}

	return {
		characters: readonly(characters),
		create,
		update,
		updateData,
		remove,
	}
})()
