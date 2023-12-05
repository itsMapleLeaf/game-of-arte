import { createSignal } from "solid-js"

export function Counter() {
	const [count, setCount] = createSignal(0)
	return (
		<div class="flex h-[100dvh] items-center justify-center gap-8 p-8">
			<button
				type="button"
				class="flex aspect-square h-16 items-center justify-center rounded border border-accent-400 bg-accent-400 bg-opacity-10 text-2xl text-white transition hover:bg-opacity-25 active:bg-opacity-50 active:duration-0"
				onClick={() => setCount((c) => c - 1)}
			>
				-
			</button>
			<p class="text-3xl">{count()}</p>
			<button
				type="button"
				class="flex aspect-square h-16 items-center justify-center rounded border border-accent-400 bg-accent-400 bg-opacity-10 text-2xl text-white transition hover:bg-opacity-25 active:bg-opacity-50 active:duration-0"
				onClick={() => setCount((c) => c + 1)}
			>
				+
			</button>
		</div>
	)
}
