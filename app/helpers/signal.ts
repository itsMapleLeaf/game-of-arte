import { startTransition, useEffect, useReducer } from "react"

export class Signal<T> {
	#value: T
	#listeners = new Set<(value: T) => void>()

	constructor(value: T) {
		this.#value = value
	}

	get value() {
		return this.#value
	}

	set value(value: T) {
		this.#value = value
		this.#emit(value)
	}

	subscribe(listener: (value: T) => void): () => void {
		this.#listeners.add(listener)
		return () => {
			this.#listeners.delete(listener)
		}
	}

	#emit(value: T) {
		for (const listener of this.#listeners) {
			listener(value)
		}
	}
}

export function useSignal<Value, Selected>(
	signal: Signal<Value>,
	select: (value: Value) => Selected,
) {
	const [value, dispatch] = useReducer(
		(_: Selected, next: Value) => select(next),
		select(signal.value),
	)
	useEffect(() => {
		return signal.subscribe((value) => {
			startTransition(() => {
				dispatch(value)
			})
		})
	}, [signal])
	return value
}
