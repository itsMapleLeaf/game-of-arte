<script lang="ts">
	import { range } from "$lib/range"
	import { setStore } from "$lib/set-store"
	import { panel } from "$lib/styles/panel"
	import { LucideMousePointer2, LucideMove } from "lucide-svelte"

	type Card = (typeof cards)[number]

	let cards = range(10).map((id) => ({
		id,
		title: `Title ${id + 1}`,
		content: `lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
		position: { x: 0, y: id * 120 },
	}))

	function updateCard(id: Card["id"], getNext: (current: Card) => Card) {
		cards = cards.map((card) => (card.id === id ? getNext(card) : card))
	}

	let selection = setStore<Card["id"]>()

	let viewportOffset = { x: 20, y: 20 }
	let draggingViewport = false

	const divider = Symbol()

	type ToolbarItem = {
		id: string
		onSelected?: () => void
		// there's no good component type that doesn't raise errors everywhere
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: any
	}

	const toolbarItems: Array<ToolbarItem | typeof divider> = [
		{
			id: "select",
			icon: LucideMousePointer2,
		},
		divider,
		{
			id: "pan",
			icon: LucideMove,
		},
	]

	let currentTool = "select"
</script>

<svelte:window
	on:pointermove={(event) => {
		if (draggingViewport) {
			event.preventDefault()
			viewportOffset.x += event.movementX
			viewportOffset.y += event.movementY
		}
	}}
	on:pointerup={() => {
		draggingViewport = false
	}}
	on:blur={() => {
		draggingViewport = false
	}}
/>

<main class="relative flex h-[100dvh] flex-col items-center overflow-hidden">
	<div
		class="absolute inset-0 touch-none"
		on:pointerdown={(event) => {
			if (event.target === event.currentTarget) {
				event.preventDefault()
				selection.clear()
				draggingViewport = true
			}
		}}
	>
		{#each cards as card}
			{@const x = card.position.x + viewportOffset.x}
			{@const y = card.position.y + viewportOffset.y}
			<div
				role="presentation"
				data-selected={$selection.has(card.id)}
				class={panel(
					"max-w-64 data-[selected=true]:border-accent-500 absolute cursor-pointer overflow-clip",
				)}
				style="transform: translate({x}px, {y}px);"
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
	</div>
	<div class={panel("absolute inset-x-auto bottom-4 flex")}>
		{#each toolbarItems as _item}
			{@const item = _item}
			{#if item === divider}
				<div class="my-2 shrink-0 basis-px self-stretch bg-slate-700" />
			{:else}
				<button
					class="p-2 transition {currentTool === item.id
						? 'text-accent-500'
						: 'opacity-50 hover:opacity-100'}"
					on:click={() => {
						currentTool = item.id
						selection.clear()
					}}
				>
					<svelte:component this={item.icon} />
				</button>
			{/if}
		{/each}
	</div>
</main>
