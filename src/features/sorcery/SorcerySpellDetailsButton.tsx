import type { ComponentPropsWithoutRef } from "react"
import {
	Dialog,
	DialogDescription,
	DialogTrigger,
	SimpleDialogContent,
} from "~/components/Dialog.tsx"
import type { SorcerySpell } from "./data"
import { formatSpellCost } from "./formatSpellCost"

export function SorcerySpellDetailsButton({
	spell,
	...props
}: ComponentPropsWithoutRef<typeof DialogTrigger> & {
	spell: SorcerySpell
}) {
	return (
		<Dialog>
			<DialogTrigger {...props} />
			<SimpleDialogContent title={spell.name}>
				<DialogDescription>{spell.description}</DialogDescription>

				<section>
					<h3 className="text-sm font-medium uppercase tracking-wide opacity-75">
						Cost
					</h3>
					<p>{formatSpellCost(spell)}</p>
				</section>

				<section>
					<h3 className="text-sm font-medium uppercase tracking-wide opacity-75">
						Casting Time
					</h3>
					<p>
						{spell.castingTime ?
							`${spell.castingTime.turns} turns`
						:	"Immediate"}
					</p>
				</section>

				<section>
					<h3 className="text-sm font-medium uppercase tracking-wide opacity-75">
						Amplified
					</h3>
					<p>{spell.amplifiedDescription}</p>
				</section>

				{spell.drawbacks && (
					<section>
						<h3 className="text-sm font-medium uppercase tracking-wide opacity-75">
							Potential Drawbacks
						</h3>
						<ul className="my-1 list-inside list-disc marker:content-['●_']">
							{spell.drawbacks.map((caveat) => (
								<li key={caveat}>{caveat}</li>
							))}
						</ul>
					</section>
				)}
			</SimpleDialogContent>
		</Dialog>
	)
}
