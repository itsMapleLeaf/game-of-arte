import { useEffect, useState } from "react"

export function usePromise<T>(input: T | PromiseLike<T>) {
	const [state, setState] = useState<
		| { status: "pending" }
		| { status: "fulfilled"; value: T }
		| { status: "rejected"; reason: unknown }
	>({ status: "pending" })

	useEffect(() => {
		if (typeof input === "object" && input !== null && "then" in input) {
			let cancelled = false

			input.then(
				(value) => {
					if (!cancelled) {
						setState({ status: "fulfilled", value })
					}
				},
				(reason) => {
					if (!cancelled) {
						setState({ status: "rejected", reason })
					}
				},
			)

			return () => {
				cancelled = true
			}
		}
		setState({ status: "fulfilled", value: input })
	}, [input])

	return state
}
