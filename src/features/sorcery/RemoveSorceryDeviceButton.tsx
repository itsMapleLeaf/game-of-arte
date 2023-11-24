import type { Doc } from "convex/_generated/dataModel"
import { LucideX } from "lucide-react"
import { ConfirmDialog } from "~/components/ConfirmDialog.tsx"
import { outlineButton } from "~/styles/button.ts"
import { useSetSorceryDeviceMutation } from "./useSetSorceryDeviceMutation"

export function RemoveSorceryDeviceButton({
	character,
}: {
	character: Doc<"characters">
}) {
	const setSorceryDevice = useSetSorceryDeviceMutation()

	return (
		<ConfirmDialog
			title="Remove Sorcery Device"
			description="Are you sure you want to remove this character's sorcery device?"
			confirmText="Remove"
			onConfirm={() => {
				setSorceryDevice({
					id: character._id,
					sorceryDevice: null,
				})
			}}
		>
			<button type="button" className={outlineButton()}>
				<LucideX /> Remove Sorcery Device
			</button>
		</ConfirmDialog>
	)
}
