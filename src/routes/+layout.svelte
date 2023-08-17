<script lang="ts" context="module">
	import "../app.css"

	import { goto } from "$app/navigation"
	import { characterStore } from "$lib/characters/character-store"
	import NavLink from "$lib/components/NavLink.svelte"
	import { container } from "$lib/styles/container"
	import { panel } from "$lib/styles/panel"
	import { LucidePlus } from "lucide-svelte"

	const { characters } = characterStore
</script>

<header class={panel("mb-4 border-b shadow")}>
	<nav class={container("-mb-px flex h-10 px-0")}>
		{#each $characters as character}
			<NavLink
				href="/characters/{character.id}"
				class="flex items-center border-b border-transparent px-4 font-medium leading-none opacity-50 aria-current-page:border-accent-400 aria-current-page:opacity-100"
			>
				{character.name}
			</NavLink>
		{/each}
		<button
			on:click={() => {
				const character = characterStore.create()
				goto(`/characters/${character.id}`)
			}}
			class="flex items-center p-3 underline hover:no-underline"
		>
			<LucidePlus />
		</button>
	</nav>
</header>

<div class={container()}>
	<slot />
</div>
