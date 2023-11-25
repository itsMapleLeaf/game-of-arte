export type DiceHint = (typeof diceHints)[number]
const diceHints = ["collectResilience"] as const

export function parseDiceHints(
	input: string[] | undefined,
): ReadonlySet<DiceHint> {
	return new Set(
		input?.filter((hint): hint is DiceHint => diceHints.includes(hint)) ?? [],
	)
}
