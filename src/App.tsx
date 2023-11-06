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
				<SideNav />
				<LoadingSuspense className="flex-1 justify-start">
					<CharacterDetails />
				</LoadingSuspense>
			</div>
		</div>
	)
}
