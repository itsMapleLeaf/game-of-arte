import { CompositeItem } from "@ariakit/react"
import type { PopoverTriggerProps } from "@radix-ui/react-popover"
import { api } from "convex/_generated/api"
import type { Condition } from "convex/characters.validators.ts"
import { useMutation } from "convex/react"
import {
	LucideBrain,
	LucideCheck,
	LucideEdit,
	LucideHeartCrack,
	LucidePlus,
	LucideX,
} from "lucide-react"
import { useState } from "react"
import * as v from "valibot"
import { Button } from "~/components/Button.tsx"
import { CounterInput } from "~/components/CounterInput.tsx"
import { Field, FieldInput, FieldLabel } from "~/components/Field.tsx"
import { Popover, PopoverPanel, PopoverTrigger } from "~/components/Popover.tsx"
import { SrOnly } from "~/components/SrOnly.tsx"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/Tooltip.tsx"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { input } from "~/styles/index.ts"
import { panel } from "~/styles/panel.ts"
import { twMerge } from "~/styles/twMerge.ts"
import { CharacterContext } from "./CharacterContext.tsx"
import { STRESS_MAX, STRESS_MIN } from "./constants.ts"

export function CharacterConditions() {
	const character = CharacterContext.useValue()

	return (
		<div className="grid gap-2">
			<ul className="flex flex-col gap-1">
				{character.conditions?.map((condition) => (
					<li key={condition.id}>
						<CharacterConditionItem condition={condition} />
					</li>
				))}
			</ul>

			<ConditionFormButton asChild>
				<Button appearance="outline" icon={{ start: LucidePlus }}>
					Add Condition
				</Button>
			</ConditionFormButton>
		</div>
	)
}

function CharacterConditionItem({ condition }: { condition: Condition }) {
	const removeCondition = useRemoveCondition(condition)
	return (
		<div className="flex gap-3">
			<div className={panel("flex flex-1 rounded-md border")}>
				<p className="flex-1 self-center px-2 py-1.5">
					{condition.description || (
						<span className="italic opacity-75">No description.</span>
					)}
				</p>

				<div className="flex -space-x-2">
					{[
						{
							label: "Physical Stress",
							icon: LucideHeartCrack,
							value: condition.physicalStress,
							className: "text-red-400",
						},
						{
							label: "Mental Stress",
							icon: LucideBrain,
							value: condition.mentalStress,
							className: "text-blue-400",
						},
					]
						.filter((item) => item.value > 0)
						.map((item) => (
							<Tooltip key={item.label} disableHoverableContent>
								<TooltipTrigger asChild>
									<CompositeItem
										render={
											<p
												className={twMerge(
													"grid cursor-default grid-cols-[1.5rem,auto] items-center gap-1 rounded-md px-2 transition hover:brightness-125",
													item.className,
												)}
											/>
										}
									>
										<item.icon /> {item.value}
									</CompositeItem>
								</TooltipTrigger>
								<TooltipContent>
									{item.value} {item.label}
								</TooltipContent>
							</Tooltip>
						))}
				</div>
			</div>

			<CompositeItem
				render={
					<Button
						appearance="faded"
						icon={{ start: LucideX }}
						square
						className="-mx-2 min-h-8"
						onClick={removeCondition}
					>
						<SrOnly>Remove</SrOnly>
					</Button>
				}
			/>

			<ConditionFormButton initialCondition={condition} asChild>
				<CompositeItem
					render={
						<Button
							appearance="faded"
							icon={{ start: LucideEdit }}
							square
							className="-mx-2 min-h-8"
						>
							<SrOnly>Edit</SrOnly>
						</Button>
					}
				/>
			</ConditionFormButton>
		</div>
	)
}

function ConditionFormButton({
	initialCondition,
	...props
}: PopoverTriggerProps & {
	initialCondition?: Condition
}) {
	const character = CharacterContext.useValue()
	const updateCharacter = useMutation(api.characters.update)
	const [open, setOpen] = useState(false)

	const [handleSubmit, state] = useAsyncCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			const values = v.parse(
				v.object({
					description: v.string(),
					physicalStress: v.coerce(
						v.number([v.integer(), v.minValue(0)]),
						Number,
					),
					mentalStress: v.coerce(
						v.number([v.integer(), v.minValue(0)]),
						Number,
					),
				}),
				Object.fromEntries(new FormData(event.currentTarget)),
			)

			const conditionsById = Object.fromEntries(
				character.conditions?.map((c) => [c.id, c]) ?? [],
			)

			if (initialCondition?.id) {
				conditionsById[initialCondition.id] = {
					...initialCondition,
					...values,
				}
			} else {
				const id = crypto.randomUUID()
				conditionsById[id] = { ...values, id }
			}

			await updateCharacter({
				id: character._id,
				conditions: Object.values(conditionsById),
			})

			setOpen(false)
		},
	)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger {...props} />
			<PopoverPanel>
				<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 p-3">
					<Field className="col-span-2">
						<FieldLabel>Condition</FieldLabel>
						<FieldInput
							type="text"
							name="description"
							className={input()}
							placeholder="What happened?"
							defaultValue={initialCondition?.description}
						/>
					</Field>
					<Field>
						<FieldLabel>Phys. Stress</FieldLabel>
						<FieldInput asChild>
							<CounterInput
								name="physicalStress"
								defaultValue={initialCondition?.physicalStress}
								min={STRESS_MIN}
								max={STRESS_MAX}
							/>
						</FieldInput>
					</Field>
					<Field>
						<FieldLabel>Ment. Stress</FieldLabel>
						<FieldInput asChild>
							<CounterInput
								name="mentalStress"
								defaultValue={initialCondition?.mentalStress}
								min={STRESS_MIN}
								max={STRESS_MAX}
							/>
						</FieldInput>
					</Field>

					<div className="col-span-2">
						<Button
							type="submit"
							className="w-full"
							pending={state.isLoading}
							icon={{ start: LucideCheck }}
						>
							Submit
						</Button>
					</div>
				</form>
			</PopoverPanel>
		</Popover>
	)
}

function useRemoveCondition(condition: { id: string }) {
	const character = CharacterContext.useValue()
	const updateCharacter = useMutation(api.characters.update)

	return async function removeCondition() {
		const conditionsById = Object.fromEntries(
			character.conditions?.map((c) => [c.id, c]) ?? [],
		)

		delete conditionsById[condition.id]

		await updateCharacter({
			id: character._id,
			conditions: Object.values(conditionsById),
		})
	}
}
