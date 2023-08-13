<script>
	import { rangeInclusive } from "$lib/range"

	let cards = rangeInclusive(1, 10).map((id) => ({
		id,
		title: `Title ${id}`,
		content: `lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
	}))
</script>

<ul class="grid justify-start gap-4 p-4">
	{#each cards as card}
		<li
			class="bg-base-800 border-base-700 max-w-64 overflow-clip rounded-md border shadow-lg"
		>
			<h2 class="bg-base-900 p-2 text-xl font-light leading-none">
				{card.title}
			</h2>
			<p class="p-2">{card.content}</p>
		</li>
	{/each}
</ul>
