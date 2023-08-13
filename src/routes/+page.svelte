<script lang="ts">
	import { range } from "$lib/range"
	import { setStore } from "$lib/set-store"

	type Card = (typeof cards)[number]

	let cards = range(10).map((id) => ({
		id,
		title: `Title ${id + 1}`,
		content: `lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
		position: { x: 20, y: 20 + id * 120 },
	}))

	let selection = setStore<Card["id"]>()

	function updateCard(id: Card["id"], getNext: (current: Card) => Card) {
		cards = cards.map((card) => (card.id === id ? getNext(card) : card))
	}
</script>

<main
	role="presentation"
	class="absolute h-screen w-screen overflow-hidden"
	on:pointerdown={(event) => {
		if (event.target === event.currentTarget) {
			selection.clear()
		}
	}}
>
	{#each cards as card}
		<div
			role="presentation"
			data-selected={$selection.has(card.id)}
			class="bg-base-800 border-base-700 max-w-64 data-[selected=true]:border-accent-500 absolute cursor-pointer overflow-clip rounded-md border shadow-lg"
			style="transform: translate({card.position.x}px, {card.position.y}px);"
			on:pointerdown={(event) => {
				event.preventDefault()
				event.stopPropagation()
				if (event.ctrlKey || event.shiftKey) {
					selection.toggle(card.id)
				} else {
					selection.set([card.id])
				}
			}}
		>
			<h2 class="bg-base-900 p-2 text-xl font-light leading-none">
				{card.title}
			</h2>
			<p class="p-2">{card.content}</p>
		</div>
	{/each}
</main>
