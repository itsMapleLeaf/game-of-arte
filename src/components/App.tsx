import { container } from "../styles/container.ts"
import { AuthButton } from "./AuthButton.tsx"
import { CharacterDetails } from "./CharacterDetails/index.tsx"
import { LoadingSuspense } from "./LoadingPlaceholder.tsx"
import { SideNav } from "./SideNav.tsx"

export function App() {
	return (
		<div className={container("flex min-h-[100dvh] flex-col gap-4 p-4")}>
			<header className="flex">
				<div className="flex flex-1 items-center justify-end">
					<AuthButton />
				</div>
			</header>
			<div className="flex flex-1 gap-4">
				<SideNav />
				<LoadingSuspense className="flex-1 justify-start">
					<CharacterDetails />
				</LoadingSuspense>
			</div>
		</div>
	)
}
