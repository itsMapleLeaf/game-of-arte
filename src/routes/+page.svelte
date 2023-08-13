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
		onInput?: (input: EditorInput) => void

		// there's no good component type that doesn't raise errors everywhere
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: any
	}

	type EditorInput =
		| {
				type: `${"window" | "viewport"}:${
					| "pointerdown"
					| "pointerup"
					| "pointermove"}`
				event: PointerEvent
		  }
		| {
				type: `card:${"pointerdown" | "pointerup" | "pointermove"}`
				event: PointerEvent
				card: Card
		  }
		| { type: "window:blur" }

	const selectTool: ToolbarItem = {
		id: "select",
		icon: LucideMousePointer2,
		onInput(input) {
			if (input.type === "card:pointerdown") {
				input.event.preventDefault()
				input.event.stopPropagation()
				selection.set([input.card.id])
			}
			if (input.type === "viewport:pointerdown") {
				input.event.preventDefault()
				input.event.stopPropagation()
				selection.clear()
			}
		},
	}

	const panTool: ToolbarItem = {
		id: "pan",
		icon: LucideMove,
		onInput(input) {
			switch (input.type) {
				case "viewport:pointerdown": {
					input.event.preventDefault()
					input.event.preventDefault()
					draggingViewport = true
					break
				}

				case "window:pointermove": {
					if (draggingViewport) {
						input.event.preventDefault()
						viewportOffset.x += input.event.movementX
						viewportOffset.y += input.event.movementY
					}
					break
				}

				case "window:pointerup":
				case "window:blur": {
					draggingViewport = false
					break
				}
			}
		},
	}

	const toolbarItems: Array<ToolbarItem | typeof divider> = [
		selectTool,
		divider,
		panTool,
	]

	let currentTool = selectTool
</script>

<svelte:window
	on:pointerdown={(event) =>
		currentTool.onInput?.({ type: "window:pointerdown", event })}
	on:pointermove={(event) =>
		currentTool.onInput?.({ type: "window:pointermove", event })}
	on:pointerup={(event) =>
		currentTool.onInput?.({ type: "window:pointerup", event })}
	on:blur={() => currentTool.onInput?.({ type: "window:blur" })}
/>

<main class="relative flex h-[100dvh] flex-col items-center overflow-hidden">
	<div
		class="absolute inset-0 touch-none"
		on:pointerdown={(event) => {
			currentTool.onInput?.({ type: "viewport:pointerdown", event })
		}}
		on:pointermove={(event) => {
			currentTool.onInput?.({ type: "viewport:pointermove", event })
		}}
		on:pointerup={(event) => {
			currentTool.onInput?.({ type: "viewport:pointerup", event })
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
					currentTool.onInput?.({ type: "card:pointerdown", event, card })
				}}
				on:pointerup={(event) => {
					currentTool.onInput?.({ type: "card:pointerup", event, card })
				}}
				on:pointermove={(event) => {
					currentTool.onInput?.({ type: "card:pointermove", event, card })
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
		{#each toolbarItems as it (it === divider ? "divider" : it.id)}
			{@const item = it}
			{#if item === divider}
				<div class="my-2 shrink-0 basis-px self-stretch bg-slate-700" />
			{:else}
				<button
					class="p-2 transition {currentTool.id === item.id
						? 'text-accent-500'
						: 'opacity-50 hover:opacity-100'}"
					on:click={() => {
						currentTool = item
						selection.clear()
					}}
				>
					<svelte:component this={item.icon} />
				</button>
			{/if}
		{/each}
	</div>
</main>
