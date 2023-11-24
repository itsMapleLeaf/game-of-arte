import type { SorcerySpell } from "./data"

export function formatSpellCost(spell: SorcerySpell) {
	return [
		`${spell.cost.mana} mana`,
		spell.cost.mentalStress && `${spell.cost.mentalStress} stress`,
	]
		.filter(Boolean)
		.join(", ")
}
