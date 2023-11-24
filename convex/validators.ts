import { Validator, v } from "convex/values"

export const record = <Value>() => v.any() as Validator<Record<string, Value>>

export const nullish = <T>(validator: Validator<T>) =>
	v.optional(v.union(validator, v.null()))
