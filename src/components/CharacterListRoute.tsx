import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"
import { LucideUserPlus } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { useLocation } from "wouter"
import { useAsyncCallback } from "../helpers/useAsyncCallback"
import { panel } from "../styles/panel"
import { CharacterList } from "./CharacterList"
import { LoadingSuspense } from "./LoadingPlaceholder"

export function CharacterListRoute() {
	return (
		<>
			<header className={panel("flex border-b p-2 shadow-md")}>
				<CreateCharacterButton className="p-2">
					<LucideUserPlus />
					<span className="sr-only">Create Character</span>
				</CreateCharacterButton>
			</header>
			<section className="grid gap-2 p-2">
				<LoadingSuspense>
					<CharacterList />
				</LoadingSuspense>
			</section>
		</>
	)
}

function CreateCharacterButton(
	props: React.ComponentPropsWithoutRef<"button">,
) {
	const [, setLocation] = useLocation()

	const [create, state] = useAsyncCallback(useMutation(api.characters.create), {
		onSuccess(data) {
			setLocation(`/characters/${data.id}`)
		},
	})

	return (
		<button
			{...props}
			disabled={props.disabled ?? state.status === "loading"}
			className={twMerge(
				state.status === "loading" && "opacity-50",
				props.className,
			)}
			onClick={() => {
				create({})
			}}
		/>
	)
}
