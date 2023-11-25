import * as ScrollArea from "@radix-ui/react-scroll-area"
import { useRect } from "@reach/rect"
import { useRef } from "react"
import { LoadingSuspense } from "./components/LoadingPlaceholder.tsx"
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
				<ScrollArea.Root className="s-full">
					<ScrollArea.Viewport
						// there's a div inside with display: table that breaks horizontal sizing
						className="pb-[--scroll-area-bottom] pr-3 pt-[--scroll-area-top] s-full [&>div]:!block"
					>
						{children}
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar
						orientation="vertical"
						className="w-1.5 pb-[--scroll-area-bottom] pt-[--scroll-area-top]"
					>
						<ScrollArea.Thumb className="rounded-full bg-white bg-opacity-25 transition-colors hover:bg-opacity-50 active:bg-accent-400" />
					</ScrollArea.Scrollbar>
				</ScrollArea.Root>
			</div>
		</div>
	)
}
