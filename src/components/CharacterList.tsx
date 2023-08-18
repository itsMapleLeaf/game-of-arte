import { api } from "convex/_generated/api"
import { useMutation } from "convex/react"
import { LucideChevronsRight, LucideUserPlus } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { Link, useLocation } from "wouter"
import { useAction } from "../helpers/useAction"
import { useQuerySuspense } from "../helpers/useQuerySuspense"
import { panel } from "../styles/panel"

const itemClass = panel(
	"flex items-center rounded-md border gap-2 p-3 text-xl font-light leading-tight shadow",
)

export function CharacterList() {
	const characters = useQuerySuspense(api.characters.list)
	return (
		<>
			<header className={panel("flex border-b p-2 shadow-md")}>
				<CreateCharacterButton className="p-2">
					<LucideUserPlus />
					<span className="sr-only">Create Character</span>
				</CreateCharacterButton>
			</header>

			<section className="grid gap-2 p-2">
				{characters.length === 0 ? (
					<p>No characters found.</p>
				) : (
					<ul className="contents">
						{characters.map((character) => (
							<li key={character._id}>
								<Link
									href={`/characters/${character._id}`}
									className={itemClass}
								>
									<LucideChevronsRight />
									{character.name}
								</Link>
							</li>
						))}
					</ul>
				)}
			</section>
		</>
	)
}

function CreateCharacterButton(
	props: React.ComponentPropsWithoutRef<"button">,
) {
	const [, setLocation] = useLocation()

	const [create, state] = useAction(useMutation(api.characters.create), {
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
