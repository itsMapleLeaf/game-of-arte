import { Redirect, Route, Switch } from "wouter"
import { useIdentify } from "../helpers/useIdentify"
import { CharacterDetails } from "./CharacterDetails"
import { CharacterListRoute } from "./CharacterListRoute"
import { ClockList } from "./ClockList"
import { DiceRoute } from "./DiceRoute"
import { LoadingSuspense } from "./LoadingPlaceholder"
import { MobileBottomNav } from "./MobileBottomNav"

export function App() {
	useIdentify()
	return (
		<div className="flex min-h-[100dvh] flex-col">
			<main className="mx-auto w-full max-w-screen-md">
				<LoadingSuspense>
					<Switch>
						<Route path="/">
							<Redirect to="/characters" />
						</Route>
						<Route path="/characters">
							<CharacterListRoute />
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
