import { api } from "convex/_generated/api.js"
import { type Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { LucideDices } from "lucide-react"
import { useAsyncCallback } from "../../helpers/useAsyncCallback.ts"
import { input } from "../../styles/index.ts"

export function AttributeInput({
	character,
	attributeName,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
	attributeName: string
	character: Doc<"characters">
}) {
	const [roll] = useAsyncCallback(useMutation(api.diceRolls.roll))

	let value = Number(props.value)
	if (!Number.isFinite(value)) {
		value = 1
	}

	return (
		<div className="flex gap-2">
			<input
				{...props}
				value={value}
				type="number"
				min={1}
				step={1}
				className={input("text-center")}
			/>
			<button
				type="button"
				className="rounded-md px-2 transition hover:bg-base-800"
				onClick={() => {
					roll({
						label: `${character.name}: ${attributeName}`,
						type: "action",
						dice: [{ count: value, sides: 12 }],
						characterId: character._id,
					})
				}}
			>
				<LucideDices />
			</button>
		</div>
	)
}
