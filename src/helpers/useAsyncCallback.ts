import { useEffect, useRef, useState } from "react"
import { useEffectEvent } from "./useEffectEvent.ts"

type AsyncCallbackState<T> =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "success"; data: T }
	| { status: "error"; error: unknown }

type UseAsyncCallbackOptions<T> = {
	onSuccess?: (data: T) => void
	onError?: (error: unknown) => void
	onSettled?: () => void
}

export function useAsyncCallback<Args extends unknown[], Return>(
	callback: (...args: Args) => Return | PromiseLike<Return>,
	options?: UseAsyncCallbackOptions<Awaited<Return>>,
) {
	const [state, setState] = useState<AsyncCallbackState<Awaited<Return>>>({
		status: "idle",
	})
	const latestToken = useRef<symbol>()

	const handleStateChange = useEffectEvent(
		(state: AsyncCallbackState<Awaited<Return>>) => {
			if (state.status === "success") {
				options?.onSuccess?.(state.data)
				options?.onSettled?.()
			}
			if (state.status === "error") {
				options?.onError?.(state.error)
				options?.onSettled?.()
			}
		},
	)

	useEffect(() => {
		handleStateChange(state)
	}, [handleStateChange, state])

	function run(...args: Args) {
		const token = (latestToken.current = Symbol())
		setState({ status: "loading" })

		void (async () => {
			try {
				const result = await callback(...args)
				if (latestToken.current === token) {
					setState({ status: "success", data: result })
				}
			} catch (error) {
				if (latestToken.current === token) {
					setState({ status: "error", error })
				}
			}
		})()
	}

	let computedState
	if (state.status === "idle") {
		computedState = {
			...state,
			isLoading: false,
			isSuccess: false,
			isError: false,
		} as const
	} else if (state.status === "loading") {
		computedState = {
			...state,
			isLoading: true,
			isSuccess: false,
			isError: false,
		} as const
	} else if (state.status === "success") {
		computedState = {
			...state,
			isLoading: false,
			isSuccess: true,
			isError: false,
		} as const
	} else {
		computedState = {
			...state,
			isLoading: false,
			isSuccess: false,
			isError: true,
		} as const
	}

	return [run, computedState] as const
}
