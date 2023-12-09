import { isObject } from "lodash-es"
import { type ReadableAtom, atom, computed } from "nanostores"

export type TaskState<T> =
	| { status: "idle" }
	| { status: "pending" }
	| { status: "fulfilled"; value: T }
	| { status: "rejected"; error: unknown }

export class TaskStore<T, Args extends unknown[]> {
	readonly #state = atom<TaskState<T>>({ status: "idle" })
	#callback: (...args: Args) => T | PromiseLike<T>
	#token: symbol | undefined

	readonly idle = computed(this.#state, (state) => state.status === "idle")

	readonly pending = computed(
		this.#state,
		(state) => state.status === "pending",
	)

	readonly value = computed(this.#state, (state) =>
		state.status === "fulfilled" ? state.value : undefined,
	)

	readonly error = computed(this.#state, (state) =>
		state.status === "rejected" ? state.error : undefined,
	)

	constructor(callback: (...args: Args) => T | PromiseLike<T>) {
		this.#callback = callback
	}

	get state(): ReadableAtom<TaskState<T>> {
		return this.#state
	}

	run(...args: Args) {
		const task = this.#callback(...args)

		const token = Symbol()
		this.#token = token

		const isThenable = isObject(task) && "then" in task
		if (!isThenable) {
			this.#state.set({ status: "fulfilled", value: task })
			return
		}

		this.#state.set({ status: "pending" })
		task.then(
			(value) => {
				if (this.#token !== token) return
				this.#state.set({ status: "fulfilled", value })
			},
			(error) => {
				if (this.#token !== token) return
				this.#state.set({ status: "rejected", error })
			},
		)
	}
}
