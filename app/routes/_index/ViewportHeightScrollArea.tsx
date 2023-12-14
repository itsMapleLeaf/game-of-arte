import { useRef } from "react"
import { expect } from "~/helpers/expect.ts"
import { useEffectEvent } from "~/helpers/useEffectEvent.ts"
import { useWindowEvent } from "~/helpers/useWindowEvent.tsx"
import {
	ScrollAreaRoot,
	ScrollAreaScrollbar,
	ScrollAreaViewport,
} from "~/ui/ScrollArea.tsx"
import { useIsomorphicLayoutEffect } from "../../helpers/useIsomorphicLayoutEffect.tsx"

export function ViewportHeightScrollArea({
	children,
}: {
	children: React.ReactNode
}) {
	const referenceRef = useRef<HTMLDivElement>(null)

	const update = useEffectEvent(() => {
		const reference = expect(referenceRef.current)
		const { offsetTop, offsetHeight, style } = reference
		const rect = reference.getBoundingClientRect()
		style.setProperty("--scroll-area-left", `${rect.left}px`)
		style.setProperty("--scroll-area-top", `${offsetTop}px`)
		style.setProperty(
			"--scroll-area-bottom",
			`${document.documentElement.scrollHeight - (offsetTop + offsetHeight)}px`,
		)
	})

	useIsomorphicLayoutEffect(update)
	useWindowEvent("resize", update)

	return (
		<div
			style={
				{
					"--scroll-area-width": "280px",
					"--scroll-area-top": "80px",
					"--scroll-area-bottom": "0px",
				} as React.CSSProperties
			}
			className="w-[--scroll-area-width]"
			ref={referenceRef}
		>
			<div className="fixed bottom-0 left-[--scroll-area-left] top-0 w-[--scroll-area-width] overflow-hidden">
				<ScrollAreaRoot className="s-full">
					<ScrollAreaViewport className="pb-[--scroll-area-bottom] pr-3 pt-[--scroll-area-top]">
						{children}
					</ScrollAreaViewport>
					<ScrollAreaScrollbar className="pb-[--scroll-area-bottom] pt-[--scroll-area-top]" />
				</ScrollAreaRoot>
			</div>
		</div>
	)
}
