import { useRef, useState } from "react"

type ActionState<T> =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "success"; data: T }
	| { status: "error"; error: unknown }

type ActionOptions<T> = {
	onSuccess?: (data: T) => void
	onError?: (error: unknown) => void
	onSettled?: () => void
}

export function useAction<Args extends unknown[], Return>(
	callback: (...args: Args) => Return | PromiseLike<Return>,
	options: ActionOptions<Awaited<Return>> = {},
) {
	const [state, setState] = useState<ActionState<Awaited<Return>>>({
		status: "idle",
	})
	const latestToken = useRef<symbol>()

	function run(...args: Args) {
		const token = (latestToken.current = Symbol())
		setState({ status: "loading" })

		void (async () => {
			try {
				const result = await callback(...args)
				if (latestToken.current === token) {
					setState({ status: "success", data: result })
					options.onSuccess?.(result)
				}
			} catch (error) {
				if (latestToken.current === token) {
					setState({ status: "error", error })
					options.onError?.(error)
				}
			} finally {
				if (latestToken.current === token) {
					options.onSettled?.()
				}
			}
		})()
	}

	return [run, state] as const
}
