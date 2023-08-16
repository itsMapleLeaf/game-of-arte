<script lang="ts">
	import { page } from "$app/stores"
	import type { HTMLAnchorAttributes } from "svelte/elements"

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = HTMLAnchorAttributes & {
		href: string
	}
	export let href: string
	$: hrefPathname = new URL(href, "http://localhost:3000").pathname
</script>

<a
	aria-current={$page.url.pathname === hrefPathname ? "page" : undefined}
	{...$$props}
	{href}
>
	<slot />
</a>
