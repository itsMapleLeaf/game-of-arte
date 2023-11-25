import type { DiceRule } from "convex/diceRolls.validators.ts"
import { ACTION_DICE_SIDES, MODIFIER_DICE_SIDES } from "./constants"

export const ACTION_DICE_RULES: DiceRule[] = [
	{
		range: { min: ACTION_DICE_SIDES },
		color: "critical",
		successes: 2,
		tooltip: "D12 Action: Critical (2)",
	},
	{
		range: { min: ACTION_DICE_SIDES - 3 },
		color: "positive",
		successes: 1,
		tooltip: "D12 Action: Success (1)",
	},
	{
		successes: 0,
		tooltip: "D12 Action: Miss",
	},
]

export const BOOST_DICE_RULES: DiceRule[] = [
	{
		range: { min: MODIFIER_DICE_SIDES },
		color: "positive",
		face: "success",
		successes: 1,
		tooltip: "D4 Boost: Success (1)",
	},
	{
		color: "positive",
		face: "blank",
		successes: 0,
		tooltip: "D4 Boost: Miss",
	},
]

export const SNAG_DICE_RULES: DiceRule[] = [
	{
		range: { min: MODIFIER_DICE_SIDES },
		color: "negative",
		face: "fail",
		successes: -1,
		tooltip: "D4 Snag: Failure (-1)",
	},
	{
		color: "negative",
		face: "blank",
		successes: 0,
		tooltip: "D4 Snag: Miss",
	},
]
