import { useStore } from "@nanostores/react"
import { mapValues } from "lodash-es"
import { LucideCheck } from "lucide-react"
import { computed } from "nanostores"
import {
	type ReactElement,
	cloneElement,
	createContext,
	createRef,
	useContext,
	useState,
} from "react"
import { twMerge } from "tailwind-merge"
import { z } from "zod"
import { TaskStore } from "~/helpers/task.ts"
import { useEffectEvent } from "~/helpers/useEffectEvent.ts"
import { Button, type ButtonProps } from "./Button.tsx"
import { Field, FieldErrors, type FieldPropsBase } from "./Field.tsx"

// biome-ignore lint/suspicious/noExplicitAny: needs to match the zod type
type AllKeys<T> = T extends any ? keyof T : never

type FormSchema = z.SomeZodObject | z.ZodEffects<z.SomeZodObject>

class FormStore<Schema extends FormSchema = FormSchema> {
	readonly #schema
	readonly #submitTask
	readonly #parseTask
	readonly #parseError

	readonly submitted
	readonly pending
	readonly errors
	readonly hasErrors
	readonly formErrors
	readonly fieldErrors
	readonly formRef = createRef<HTMLFormElement>()

	constructor(options: {
		schema: Schema
		onSubmit: (values: z.output<Schema>) => unknown
	}) {
		this.#schema = options.schema

		this.#parseTask = new TaskStore(() => {
			if (!this.formRef.current) {
				throw new Error("Form ref not set")
			}
			console.log(Object.fromEntries(new FormData(this.formRef.current)))
			return options.schema.safeParseAsync(
				Object.fromEntries(new FormData(this.formRef.current)),
			)
		})

		this.#parseError = computed(this.#parseTask.value, (result) =>
			result?.success === false ? result.error.flatten() : undefined,
		)

		this.#submitTask = new TaskStore(async (event: React.FormEvent) => {
			event.preventDefault()
			const result = this.#parseTask.value.get()
			if (result?.success === true) {
				await options.onSubmit(result.data)
			}
		})

		this.submitted = computed(
			[this.#submitTask.idle],
			(submitIdle) => !submitIdle,
		)

		this.pending = computed(
			[this.#parseTask.pending, this.#submitTask.pending],
			(parsePending, submitPending) => parsePending || submitPending,
		)

		this.errors = computed(
			[this.#parseError, this.#submitTask.error, this.submitted],
			(parseError, submitError, submitted) => {
				if (!submitted) {
					return undefined
				}

				if (submitError && parseError?.formErrors.length === 0) {
					return {
						...parseError,
						formErrors: [
							"Something went wrong. Check for issues and try again.",
						],
					}
				}

				return parseError
			},
		)

		this.hasErrors = computed([this.errors], (errors) => errors !== undefined)

		this.formErrors = computed([this.errors], (errors) => errors?.formErrors)

		this.fieldErrors = computed([this.errors], (errors) => errors?.fieldErrors)
	}

	fieldErrorsFor(name: string) {
		return computed(this.fieldErrors, (fieldErrors) => fieldErrors?.[name])
	}

	get names() {
		const shape =
			"shape" in this.#schema ?
				this.#schema.shape
			:	this.#schema.innerType().shape

		return mapValues(shape, (_, key) => key) as {
			[K in AllKeys<z.input<Schema>>]: K
		}
	}

	get formProps() {
		return {
			onSubmit: this.#submitTask.run,
			ref: this.formRef,
		}
	}

	handleChange() {
		if (!this.formRef.current) {
			throw new Error("Form ref not set")
		}
		this.#parseTask.run()
	}

	submit(event: React.FormEvent) {
		this.#submitTask.run(event)
	}
}

const FormContext = createContext<FormStore | undefined>(undefined)

function useFormContext() {
	const context = useContext(FormContext)
	if (!context) {
		throw new Error("Form context not set")
	}
	return context
}

export function useForm<Schema extends FormSchema>(options: {
	schema: Schema
	onSubmit: (values: z.output<Schema>) => unknown
}) {
	const onSubmit = useEffectEvent(options.onSubmit)
	const [form] = useState(() => new FormStore({ ...options, onSubmit }))
	return form
}

export function Form({
	form,
	children,
	...props
}: React.ComponentPropsWithRef<"form"> & { form: FormStore }) {
	const errors = useStore(form.formErrors)
	return (
		<form
			{...props}
			ref={form.formRef}
			className={twMerge("grid gap-4", props.className)}
			onSubmit={(event) => form.submit(event)}
		>
			<FormContext.Provider value={form}>{children}</FormContext.Provider>
			<FieldErrors className="text-center" errors={errors} />
		</form>
	)
}

export function FormField({
	input,
	...props
}: Partial<FieldPropsBase> & {
	name: string
	input: ReactElement
}) {
	const form = useFormContext()
	const errors = useStore(form.fieldErrorsFor(props.name))
	return (
		<Field {...props}>
			{cloneElement(input, {
				name: props.name,
				onChange: (...args: unknown[]) => {
					form.handleChange()
					input.props.onChange?.(...args)
				},
			})}
			<FieldErrors errors={errors} />
		</Field>
	)
}

export function FormButton({
	children = "Submit",
	icon = LucideCheck,
	...props
}: ButtonProps) {
	const form = useFormContext()
	const pending = useStore(form.pending)
	return (
		<Button
			type="submit"
			appearance="solid"
			icon={icon}
			pending={pending}
			{...props}
		>
			{children}
		</Button>
	)
}
