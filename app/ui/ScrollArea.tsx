import * as ScrollAreaBase from "@radix-ui/react-scroll-area"
import { autoRef } from "~/helpers/autoRef.tsx"
import { twMerge } from "~/ui/twMerge"

export const ScrollArea = autoRef(function ScrollArea({
	children,
	...props
}: ScrollAreaBase.ScrollAreaProps) {
	return (
		<ScrollAreaRoot {...props}>
			<ScrollAreaViewport>{children}</ScrollAreaViewport>
			<ScrollAreaScrollbar />
		</ScrollAreaRoot>
	)
})

export const ScrollAreaRoot = ScrollAreaBase.Root

export const ScrollAreaViewport = autoRef(function ScrollAreaViewport(
	props: ScrollAreaBase.ScrollAreaViewportProps,
) {
	return (
		<ScrollAreaBase.Viewport
			{...props}
			className={twMerge(
				"s-full",
				// there's a div inside with display: table that breaks horizontal sizing
				"[&>div]:!block",
				// GPU-accelerated scrolling
				"[transform:translateZ(0)]",
				props.className,
			)}
		/>
	)
})

export const ScrollAreaScrollbar = autoRef(function ScrollAreaScrollbar(
	props: ScrollAreaBase.ScrollAreaScrollbarProps,
) {
	return (
		<ScrollAreaBase.Scrollbar
			{...props}
			className={twMerge("w-2.5 p-0.5", props.className)}
		>
			<ScrollAreaBase.Thumb className="rounded-full bg-white bg-opacity-25 transition-colors hover:bg-opacity-50 active:bg-accent-400" />
		</ScrollAreaBase.Scrollbar>
	)
})
