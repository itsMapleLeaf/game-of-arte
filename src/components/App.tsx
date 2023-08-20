import { LucideClock, LucideDices, LucideUsers } from "lucide-react"
import { AppParams } from "../helpers/useAppParams.ts"
import { container } from "../styles/container"
import { AuthButton } from "./AuthButton"
import { CharacterDetails } from "./CharacterDetails"
import { CharacterList } from "./CharacterList"
import { LoadingSuspense } from "./LoadingPlaceholder"
import { SideNav } from "./SideNav"

export function App() {
	return (
		<div className={container("flex min-h-[100dvh] flex-col gap-4 p-4")}>
			<header className="flex">
				<div className="flex flex-1 items-center justify-end">
					<AuthButton />
				</div>
			</header>
			<div className="flex flex-1 gap-4">
				<SideNav
					views={[
						{
							id: "characters",
							title: "Characters",
							icon: LucideUsers,
							content: <CharacterList />,
						},
						{
							id: "dice",
							title: "Dice",
							icon: LucideDices,
							content: <p>todo</p>,
						},
						{
							id: "clocks",
							title: "Clocks",
							icon: LucideClock,
							content: <p>todo</p>,
						},
					]}
				/>

				<AppParams>
					{({ characterId }) =>
						characterId.current && (
							<LoadingSuspense className="flex-1 justify-start">
								<CharacterDetails characterId={characterId.current} />
							</LoadingSuspense>
						)
					}
				</AppParams>
			</div>
		</div>
	)
}
