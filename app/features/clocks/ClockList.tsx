import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel.js"
import { useMutation, useQuery } from "convex/react"
import { LucidePlus, LucideX } from "lucide-react"
import { useId, useRef } from "react"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import { expect } from "~/helpers/expect.ts"
import { mapIterable } from "~/helpers/iterable.ts"
import { Field, FieldInput, FieldLabel } from "../../components/Field.tsx"
import { clamp } from "../../helpers/math.ts"
import { range } from "../../helpers/range.ts"
import { useWindowEvent } from "../../helpers/useWindowEvent.tsx"
import { AdminRoleGuard } from "../auth/AdminRoleGuard.tsx"

export function ClockList() {
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			<AdminRoleGuard>
				<AddClockButton />
			</AdminRoleGuard>
			<ClockItems />
		</div>
	)
}

function AddClockButton() {
	const add = useMutation(api.clocks.add)
	return (
		<button
			type="button"
			className="flex gap-2 p-2 opacity-75 transition hover:bg-base-800 hover:opacity-100"
			onClick={() => {
				void add()
			}}
		>
			<LucidePlus /> New Clock
		</button>
	)
}

function ClockItems() {
	const clocks = useQuery(api.clocks.list)
	return (
		<ul className="min-h-0 flex-1 divide-y divide-base-800 overflow-y-auto">
			<li className="flex flex-col gap-2 p-3">
				<WorldManaClock />
			</li>
			{clocks === undefined ?
				<LoadingPlaceholder />
			:	clocks.map((clock) => (
					<li key={clock._id} className="flex flex-col gap-2 p-3">
						<ClockEditor clock={clock} />
					</li>
				))
			}
		</ul>
	)
}

const manaClockSize = 10

function WorldManaClock() {
	const world = useQuery(api.world.get)

	const update = useMutation(api.world.update).withOptimisticUpdate(
		(store, args) => {
			if (!world) return
			store.setQuery(api.world.get, {}, { ...world, ...args })
		},
	)

	return (
		<>
			<h3 className="text-center text-xl font-light">Mana</h3>
			{world === undefined ?
				<LoadingPlaceholder />
			:	<ClockRangeInput
					value={world.mana ?? manaClockSize}
					maxValue={manaClockSize}
					onChange={(mana) => update({ mana })}
				/>
			}
		</>
	)
}

function ClockEditor({ clock }: { clock: Doc<"clocks"> }) {
	const update = useMutation(api.clocks.update).withOptimisticUpdate(
		(store, args) => {
			const clocks = store.getQuery(api.clocks.list) ?? []
			store.setQuery(
				api.clocks.list,
				{},
				clocks.map((clock) => {
					return clock._id === args.id ? { ...clock, ...args } : clock
				}),
			)
		},
	)

	const remove = useMutation(api.clocks.remove).withOptimisticUpdate(
		(store, args) => {
			const clocks = store.getQuery(api.clocks.list) ?? []
			store.setQuery(
				api.clocks.list,
				{},
				clocks.filter((clock) => clock._id !== args.id),
			)
		},
	)

	return (
		<>
			<div className="flex gap-2">
				<Field className="flex-1">
					<FieldLabel size="sm">Name</FieldLabel>
					<FieldInput
						value={clock.name}
						onChange={(event) => {
							void update({
								id: clock._id,
								name: event.currentTarget.value,
							})
						}}
						className="min-w-0 rounded-md bg-black/25 p-2 leading-none transition focus:bg-black/50"
					/>
				</Field>

				<Field>
					<FieldLabel size="sm">Ticks</FieldLabel>
					<FieldInput
						type="number"
						value={clock.maxValue}
						onChange={(event) => {
							void update({
								id: clock._id,
								maxValue: event.currentTarget.valueAsNumber,
							})
						}}
						className="w-16 rounded-md bg-black/25 px-3 py-2 leading-none transition focus:bg-black/50"
					/>
				</Field>

				<AdminRoleGuard>
					<button
						type="button"
						className="-mx-1.5 self-end p-1.5 opacity-75 transition hover:opacity-100"
						onClick={() => {
							void remove({ id: clock._id })
						}}
					>
						<LucideX />
						<span className="sr-only">Remove</span>
					</button>
				</AdminRoleGuard>
			</div>
			<ClockRangeInput
				value={clock.value}
				maxValue={clock.maxValue}
				onChange={(value) => {
					void update({ id: clock._id, value })
				}}
			/>
		</>
	)
}

function ClockRangeInput({
	value,
	maxValue,
	onChange,
}: {
	value: number
	maxValue: number
	onChange: (value: number) => void
}) {
	const labelRef = useRef<HTMLLabelElement>(null)
	const draggingRef = useRef(false)

	const handleSliderUpdate = (
		event: React.PointerEvent<HTMLLabelElement> | PointerEvent,
	) => {
		const rect = expect(labelRef.current).getBoundingClientRect()
		const value = Math.round(
			((event.clientX - (rect.left + 2)) / rect.width) * maxValue,
		)
		onChange(clamp(value, 0, maxValue))
	}

	useWindowEvent("pointermove", (event) => {
		if (draggingRef.current) {
			handleSliderUpdate(event)
			event.preventDefault()
		}
	})

	useWindowEvent("pointerup", (event) => {
		if (draggingRef.current) {
			draggingRef.current = false
			event.preventDefault()
		}
	})

	useWindowEvent("blur", (event) => {
		if (draggingRef.current) {
			draggingRef.current = false
			event.preventDefault()
		}
	})

	const valueId = useId()

	return (
		<div className="relative col-span-full rounded-md">
			<input
				id={valueId}
				type="range"
				className="absolute inset-0 appearance-none opacity-0"
				value={value}
				min={0}
				max={maxValue}
				onChange={(event) => {
					onChange(event.currentTarget.valueAsNumber)
				}}
			/>
			<label
				htmlFor={valueId}
				ref={labelRef}
				className="group relative flex h-8 w-full touch-none flex-row rounded-md border-2 border-accent-500 ring-accent-400 ring-no-inset focus-visible:ring-2"
				onPointerDown={(event) => {
					event.preventDefault()
					draggingRef.current = true
					handleSliderUpdate(event)
				}}
			>
				<span className="sr-only">Value</span>
				{[
					...mapIterable(range(maxValue), (tick) => (
						<div
							key={tick}
							className="absolute bottom-0 left-0 top-0 w-px bg-accent-500"
							style={{ left: `${(tick / maxValue) * 100}%` }}
						/>
					)),
				]}
				<div
					className="absolute inset-0 bg-accent-500/50"
					style={{
						width: `${(clamp(value, 0, maxValue) / maxValue) * 100}%`,
					}}
				/>
			</label>
		</div>
	)
}
