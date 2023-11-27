import { useRect } from "@reach/rect"
import { useRef } from "react"
import { LoadingSuspense } from "./components/LoadingPlaceholder.tsx"
import {
	ScrollAreaRoot,
	ScrollAreaScrollbar,
	ScrollAreaViewport,
} from "./components/ScrollArea.tsx"
import { SideNav } from "./components/SideNav.tsx"
import { AuthButton } from "./features/auth/AuthButton.tsx"
import { CharacterDetails } from "./features/characters/CharacterDetails.tsx"
import { container } from "./styles/container.ts"

export function App() {
	return (
		<div className={container("flex min-h-[100dvh] flex-col gap-4 p-4")}>
			<header className="flex">
				<div className="flex flex-1 items-center justify-end">
					<AuthButton />
				</div>
			</header>
			<div className="flex flex-1 gap-4">
				<ViewportHeightScrollArea>
					<SideNav />
				</ViewportHeightScrollArea>
				<LoadingSuspense className="flex-1 justify-start">
					<CharacterDetails />
				</LoadingSuspense>
			</div>
		</div>
	)
}

function ViewportHeightScrollArea({ children }: { children: React.ReactNode }) {
	const referenceRef = useRef<HTMLDivElement>(null)
	const rect = useRect(referenceRef)

	const scrollAreaTop = referenceRef.current?.offsetTop

	const scrollAreaBottom =
		document.documentElement.scrollHeight -
		((referenceRef.current?.offsetTop ?? 0) +
			(referenceRef.current?.offsetHeight ?? 0))

	return (
		<div
			className="w-[280px]"
			style={
				{
					"--scroll-area-top": `${scrollAreaTop ?? 0}px`,
					"--scroll-area-bottom": `${scrollAreaBottom ?? 0}px`,
				} as React.CSSProperties
			}
			ref={referenceRef}
		>
			<div
				className="fixed bottom-0 top-0"
				style={{
					left: rect?.left,
					width: rect?.width,
				}}
			>
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
