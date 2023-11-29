import type { SorcerySpell } from "./spells"

export function formatSpellCost(spell: SorcerySpell) {
	return [
		`${spell.cost.mana} mana`,
		spell.cost.mentalStress && `${spell.cost.mentalStress} stress`,
	]
		.filter(Boolean)
		.join(", ")
}
