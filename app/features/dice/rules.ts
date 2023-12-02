import type { DiceRule } from "convex/diceRolls.validators.ts"
import {
	ACTION_DICE_SIDES,
	MODIFIER_DICE_SIDES,
	MODIFIER_DICE_THRESHOLD,
} from "./constants"

export const ACTION_DICE_RULES: DiceRule[] = [
	{
		range: { min: ACTION_DICE_SIDES },
		color: "critical",
		successes: 2,
		tooltip: `D${ACTION_DICE_SIDES} Action: Critical (2)`,
	},
	{
		range: { min: ACTION_DICE_SIDES - 3 },
		color: "positive",
		successes: 1,
		tooltip: `D${ACTION_DICE_SIDES} Action: Success (1)`,
	},
	{
		successes: 0,
		tooltip: `D${ACTION_DICE_SIDES} Action: Miss`,
	},
]

export const BOOST_DICE_RULES: DiceRule[] = [
	{
		range: { min: MODIFIER_DICE_THRESHOLD },
		color: "positive",
		face: "success",
		successes: 1,
		tooltip: `D${MODIFIER_DICE_SIDES} Boost: Success (1)`,
	},
	{
		color: "positive",
		face: "blank",
		successes: 0,
		tooltip: `D${MODIFIER_DICE_SIDES} Boost: Miss`,
	},
]

export const SNAG_DICE_RULES: DiceRule[] = [
	{
		range: { min: MODIFIER_DICE_THRESHOLD },
		color: "negative",
		face: "fail",
		successes: -1,
		tooltip: `D${MODIFIER_DICE_SIDES} Snag: Failure (-1)`,
	},
	{
		color: "negative",
		face: "blank",
		successes: 0,
		tooltip: `D${MODIFIER_DICE_SIDES} Snag: Miss`,
	},
]
