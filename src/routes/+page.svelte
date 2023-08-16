<script lang="ts">
	import { goto } from "$app/navigation"
	import { characterStore } from "$lib/characters/character-store"
	import { onMount } from "svelte"

	const { characters } = characterStore
	$: character = $characters[0]

	onMount(() => {
		if (character) goto(`/characters/${character.id}`)
	})
</script>

{#if character}
	<p>Redirecting...</p>
{:else}
	<p>No characters created yet</p>
{/if}
