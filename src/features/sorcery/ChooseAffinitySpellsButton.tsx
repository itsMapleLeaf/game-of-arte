import type { Doc } from "convex/_generated/dataModel"
import { LucideSparkles } from "lucide-react"
import { useState } from "react"
import {
	Dialog,
	DialogTrigger,
	SimpleDialogContent,
} from "~/components/Dialog.tsx"
import { solidButton } from "~/styles/button.ts"
import { SorcerySpellSelect } from "./SorcerySpellSelect.tsx"
import { useSetSorceryDeviceMutation } from "./useSetSorceryDeviceMutation.tsx"

export function ChooseAffinitySpellsButton({
	character,
	sorceryDevice,
}: {
	character: Doc<"characters">
	sorceryDevice: NonNullable<Doc<"characters">["sorceryDevice"]>
}) {
	const [open, setOpen] = useState(false)

	const setSorceryDevice = useSetSorceryDeviceMutation()

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger type="button" className={solidButton()}>
				<LucideSparkles /> Choose Affinity Spells
			</DialogTrigger>
			<SimpleDialogContent title="Choose Affinity Spells">
				<SorcerySpellSelect
					count={3}
					initialSpellIds={Object.values(sorceryDevice.affinities ?? {})}
					onSubmit={([first, second, third]) => {
						if (first && second && third) {
							setSorceryDevice({
								id: character._id,
								sorceryDevice: {
									...sorceryDevice,
									affinities: {
										first,
										second,
										third,
									},
								},
							})
							setOpen(false)
						}
					}}
				/>
			</SimpleDialogContent>
		</Dialog>
	)
}
