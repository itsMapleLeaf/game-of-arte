import type { DialogTriggerProps } from "@radix-ui/react-dialog"
import type { Doc } from "convex/_generated/dataModel"
import { useState } from "react"
import {
	Dialog,
	DialogTrigger,
	SimpleDialogContent,
} from "~/components/Dialog.tsx"
import { SorcerySpellSelect } from "./SorcerySpellSelect.tsx"
import { useSetSorceryDeviceMutation } from "./useSetSorceryDeviceMutation.tsx"

export function ChooseAffinitySpellsButton({
	character,
	sorceryDevice,
	...props
}: DialogTriggerProps & {
	character: Doc<"characters">
	sorceryDevice: NonNullable<Doc<"characters">["sorceryDevice"]>
}) {
	const [open, setOpen] = useState(false)

	const setSorceryDevice = useSetSorceryDeviceMutation()

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger {...props} />
			<SimpleDialogContent title="Choose Affinity Spells">
				<SorcerySpellSelect
					sorceryDevice={sorceryDevice}
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
