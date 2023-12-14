import { api } from "convex/_generated/api.js"
import { useMutation } from "convex/react"
import { LucideDices } from "lucide-react"
import { useState } from "react"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { CounterInput } from "~/ui/CounterInput"
import { Field, FieldInput, FieldLabel, FieldLabelText } from "~/ui/Field"

export function DiceRollForm() {
	const [label, setLabel] = useState("")
	const [count, setCount] = useState(1)
	const [roll, state] = useAsyncCallback(useMutation(api.diceRolls.roll))
	return (
		<form
			className="grid grid-cols-[1fr,auto] gap-2 p-2"
			onSubmit={(event) => {
				event.preventDefault()
				roll({ label, dice: [{ count, sides: 12 }] })
			}}
		>
			<div className="col-span-2">
				<Field>
					<FieldLabel>Label</FieldLabel>
					<FieldInput
						value={label}
						onChange={(event) => setLabel(event.target.value)}
						className="h-10 min-w-0 rounded bg-black/50 px-3 leading-none"
						placeholder="Fortune: Escape"
					/>
				</Field>
			</div>
			<Field>
				<FieldLabelText>Dice Count</FieldLabelText>
				<FieldInput asChild>
					<CounterInput
						defaultValue={1}
						min={1}
						value={count}
						onChange={setCount}
						className="h-10 border-0 bg-black/50"
					/>
				</FieldInput>
			</Field>
			<button
				type="submit"
				className="flex h-10 items-center gap-2 self-end rounded bg-black/50 px-3"
			>
				<LucideDices className={state.isLoading ? "animate-spin" : ""} />
				Roll
			</button>
		</form>
	)
}
