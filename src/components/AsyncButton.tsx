import type { ComponentPropsWithRef } from "react"
import { twMerge } from "tailwind-merge"
import { autoRef } from "../helpers/autoRef.ts"
import type { Spread } from "../helpers/types.ts"
import { useAsyncCallback } from "../helpers/useAsyncCallback.ts"

export const AsyncButton = autoRef(function AsyncButton({
	onClick,
	...props
}: Spread<
	ComponentPropsWithRef<"button">,
	{
		onClick: (event: React.MouseEvent) => PromiseLike<unknown>
	}
>) {
	const [handleClick, state] = useAsyncCallback(
		async (event: React.MouseEvent<HTMLButtonElement>) => {
			try {
				await onClick(event)
			} catch (error) {
				console.error(error)
			}
		},
	)
	return (
		<button
			type="button"
			{...props}
			onClick={handleClick}
			disabled={props.disabled ?? state.isLoading}
			className={twMerge("disabled:opacity-50", props.className)}
		/>
	)
})
