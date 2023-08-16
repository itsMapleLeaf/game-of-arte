<script lang="ts">
	import { characterSheetLayout } from "$lib/characters/character-sheet-layout"
	import {
		characterStore,
		type Character,
	} from "$lib/characters/character-store"
	import { panel } from "../styles/panel"
	export let character: Character
</script>

<div class="grid gap-4">
	<div class="grid gap-1">
		<label for="name" class="text-sm font-medium leading-none">Name</label>
		<input
			id="name"
			class={panel("h-10 min-w-0 rounded border px-3")}
			value={character.name}
			on:input={(event) => {
				characterStore.update(character.id, {
					name: event.currentTarget.value,
				})
			}}
		/>
	</div>

	{#each characterSheetLayout as row}
		<div class="grid auto-cols-fr gap-4 sm:grid-flow-col">
			{#each row.columns as column}
				<div class="grid content-start gap-2">
					{#each column.fields as field}
						<div class="grid gap-1">
							<label for={field.id} class="text-sm font-medium leading-none">
								{field.label}
							</label>
							<input
								id={field.id}
								class={panel("h-10 min-w-0 rounded border px-3")}
								value={character.data[field.id] ?? ""}
								on:input={(event) => {
									characterStore.updateData(character.id, {
										[field.id]: event.currentTarget.value,
									})
								}}
							/>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/each}
</div>
