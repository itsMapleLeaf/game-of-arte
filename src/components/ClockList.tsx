import { api } from "convex/_generated/api.js"
import type { Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { LucidePlus, LucideX } from "lucide-react"
import { useEffect, useId, useRef } from "react"
import { parseNonNil } from "../helpers/errors.ts"
import { clamp } from "../helpers/index.ts"
import { range } from "../helpers/range.ts"
import { useQuerySuspense } from "../helpers/useQuerySuspense.ts"
import { Field, FieldInput, FieldLabel } from "./Field.tsx"

export function ClockList() {
	const roles = useQuerySuspense(api.roles.get)
	return (
		<div className="flex h-full flex-col divide-y divide-base-800">
			{roles.isAdmin && <AddClockButton />}
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
	const clocks = useQuerySuspense(api.clocks.list)

	return (
		<ul className="min-h-0 flex-1 divide-y divide-base-800 overflow-y-auto">
			{clocks.map((clock) => (
				<li key={clock._id}>
					<ClockEditor clock={clock} />
				</li>
			))}
		</ul>
	)
}

function ClockEditor({ clock }: { clock: Doc<"clocks"> }) {
	const roles = useQuerySuspense(api.roles.get)

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

	const labelRef = useRef<HTMLLabelElement>(null)
	const draggingRef = useRef(false)

	const handleSliderUpdate = (
		event: React.PointerEvent<HTMLLabelElement> | PointerEvent,
	) => {
		const rect = parseNonNil(labelRef.current).getBoundingClientRect()
		const value = Math.round(
			((event.clientX - (rect.left + 2)) / rect.width) * clock.maxValue,
		)
		void update({ id: clock._id, value: clamp(value, 0, clock.maxValue) })
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
		<div className="flex flex-col gap-2 p-3">
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

				{roles.isAdmin && (
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
				)}
			</div>

			<div className="relative col-span-full rounded-md">
				<input
					id={valueId}
					type="range"
					className="absolute inset-0 appearance-none opacity-0"
					value={clock.value}
					min={0}
					max={clock.maxValue}
					onChange={(event) => {
						void update({
							id: clock._id,
							value: event.currentTarget.valueAsNumber,
						})
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
					{range(clock.maxValue).map((tick) => (
						<div
							key={tick}
							className="absolute bottom-0 left-0 top-0 w-px bg-accent-500"
							style={{ left: `${(tick / clock.maxValue) * 100}%` }}
						/>
					))}
					<div
						className="absolute inset-0 bg-accent-500/50"
						style={{
							width: `${
								(clamp(clock.value, 0, clock.maxValue) / clock.maxValue) * 100
							}%`,
						}}
					/>
				</label>
			</div>
		</div>
	)
}

function useWindowEvent<T extends keyof WindowEventMap>(
	event: T,
	listener: (event: WindowEventMap[T]) => void,
	options?: boolean | AddEventListenerOptions,
) {
	useEffect(() => {
		window.addEventListener(event, listener, options)
		return () => {
			window.removeEventListener(event, listener, options)
		}
	})
}
