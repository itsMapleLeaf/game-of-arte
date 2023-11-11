import { api } from "convex/_generated/api.js"
import { atom } from "nanostores"
import { useCallback, useEffect, useState, useTransition } from "react"
import { useSpinDelay } from "spin-delay"
import { autoRef } from "~/helpers/autoRef.ts"
import { useQueriesSuspense } from "../../helpers/useQuerySuspense.ts"

const characterIdAtom = atom(localStorage.getItem("characterId"))

characterIdAtom.listen((characterId) => {
	if (characterId) {
		localStorage.setItem("characterId", characterId)
	}
})

export function useCurrentCharacterId() {
	// useStore doesn't work with suspense
	const [characterId, setCharacterId] = useState(characterIdAtom.get())
	useEffect(() => characterIdAtom.listen(setCharacterId), [])
	return characterId
}

export function useSetCurrentCharacterId() {
	return useCallback((characterId: string) => {
		characterIdAtom.set(characterId)
	}, [])
}

export function useCurrentCharacter() {
	const characterId = useCurrentCharacterId()

	// TODO: this should be one query
	const { characters, loadedCharacter, assignedCharacter } = useQueriesSuspense(
		{
			characters: { query: api.characters.list, args: {} },
			loadedCharacter: {
				query: api.characters.get,
				args: { id: characterId },
			},
			assignedCharacter: { query: api.characters.getOwned, args: {} },
		},
	)

	if (!characterId) {
		return assignedCharacter ?? characters[0]
	}

	return loadedCharacter
}

export const SetCharacterButton = autoRef(function SetCharacterButton({
	characterId,
	...props
}: { characterId: string } & React.ComponentPropsWithRef<"button">) {
	const [isPending, startTransition] = useTransition()
	const isPendingDelayed = useSpinDelay(isPending)
	const setCurrentCharacterId = useSetCurrentCharacterId()
	return (
		<button
			type="button"
			{...props}
			data-pending={isPendingDelayed || undefined}
			onClick={(event) => {
				startTransition(() => {
					setCurrentCharacterId(characterId)
					props.onClick?.(event)
				})
			}}
		/>
	)
})
