import { ChevronDown } from "lucide-react"
import { useLayoutEffect, useState } from "react"
import { autoRef } from "~/helpers/autoRef.tsx"
import { expect } from "~/helpers/expect.ts"
import { rangeInclusive } from "~/helpers/range.ts"
import { Button, buttonIconStyle } from "./Button.tsx"

export interface FoldableProps {
	children: React.ReactNode
}

const logarithmicGradient = (steps: number, length = "100%") =>
	[...rangeInclusive(0, 1, 1 / steps)]
		.map(
			(value) => `rgb(255 255 255 / ${value ** 2}) calc(${value} * ${length})`,
		)
		.join(",")

export const Foldable = autoRef(function Foldable({ children }: FoldableProps) {
	const [open, setOpen] = useState(false)
	const [contentSize, contentSizeRef] = useElementSize()
	const folding = contentSize.height >= 100
	return (
		<div>
			{folding && (
				<Button
					appearance="faded"
					size="small"
					className="-mx-2"
					onClick={() => setOpen(!open)}
				>
					<ChevronDown
						aria-hidden
						className={buttonIconStyle({
							size: "small",
							className: ["transition", open ? "rotate-180" : ""],
						})}
					/>
					{open ? "Collapse" : "Expand"}
				</Button>
			)}
			<div
				style={{
					height: open ? contentSize.height : Math.min(contentSize.height, 100),
					WebkitMaskImage:
						folding && !open ?
							`linear-gradient(to top, transparent, ${logarithmicGradient(
								4,
								"60px",
							)}`
						:	undefined,
				}}
				className="relative overflow-hidden bg-inherit transition-all duration-300"
			>
				<div ref={contentSizeRef} className="absolute inset-x-0 w-full">
					{children}
				</div>
			</div>
		</div>
	)
})

function useElementSize() {
	const [size, setSize] = useState({ width: 0, height: 0 })
	const [element, ref] = useState<HTMLElement | null>()

	useLayoutEffect(() => {
		if (!element) return

		setSize(element.getBoundingClientRect())

		const observer = new ResizeObserver(([entry]) => {
			setSize(expect(entry).contentRect)
		})
		observer.observe(element)
		return () => observer.disconnect()
	}, [element])

	return [size, ref] as const
}
