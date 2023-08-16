<script lang="ts">
	import { page } from "$app/stores"
	import CharacterSheet from "$lib/characters/CharacterSheet.svelte"
	import { characterStore } from "$lib/characters/character-store"

	const { characters } = characterStore
	$: character = $characters.find(
		(character) => character.id === $page.params.characterId,
	)
</script>

{#if character}
	<CharacterSheet {character} />
{:else}
	<p>Character not found</p>
{/if}
