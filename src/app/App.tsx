import { Redirect, Route, Switch } from "wouter"
import { useIdentify } from "~/auth/useIdentify"
import { CharacterDetails } from "~/characters/CharacterDetails"
import { CharacterList } from "~/characters/CharacterList"
import { ClockList } from "~/clocks/ClockList"
import { DiceRoute } from "~/dice/DiceRoute"
import { LoadingSuspense } from "./LoadingPlaceholder"
import { MobileBottomNav } from "./MobileBottomNav"

export function App() {
	useIdentify()
	return (
		<div className="flex min-h-[100dvh] flex-col">
			<main className="mx-auto w-full max-w-screen-md p-2 sm:p-4 md:py-8">
				<LoadingSuspense>
					<Switch>
						<Route path="/">
							<Redirect to="/characters" />
						</Route>
						<Route path="/characters">
							<CharacterList />
						</Route>
						<Route path="/characters/:characterId">
							{(props) => <CharacterDetails {...props} />}
						</Route>
						<Route path="/clocks">
							<ClockList />
						</Route>
						<Route path="/dice">
							<DiceRoute />
						</Route>
					</Switch>
				</LoadingSuspense>
			</main>
			<MobileBottomNav />
		</div>
	)
}
