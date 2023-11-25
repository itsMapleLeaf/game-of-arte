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
	return (
		<div className="w-64" ref={referenceRef}>
			<div
				className="fixed bottom-0 top-0 overflow-y-auto pb-4"
				style={{
					left: rect?.left,
					width: rect?.width,
					paddingTop: referenceRef.current?.offsetTop,
				}}
			>
				{children}
			</div>
		</div>
	)
}
