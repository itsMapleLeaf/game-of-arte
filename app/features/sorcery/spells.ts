import { z } from "zod"
import type { Subset } from "~/helpers/types.ts"
import type { AttributeId } from "../characters/attributes.ts"

export type SorcerySpellAttributeId = Subset<
	AttributeId,
	"nature" | "metaphysical" | "psychic" | "taboo"
>
export const sorcerySpellAttributeIdSchema = z.enum([
	"nature",
	"metaphysical",
	"psychic",
	"taboo",
]) satisfies z.ZodType<SorcerySpellAttributeId>

export interface SorcerySpell {
	name: string
	description: string
	amplifiedDescription: string
	attributeId: SorcerySpellAttributeId
	cost: { mana: number; mentalStress?: number }
	castingTime?: { turns: number }
	drawbacks?: string[]
}
export type SorcerySpellId = string

export const sorcerySpells: Record<SorcerySpellId, SorcerySpell> = {
	heat: {
		name: "Heat",
		description: `Increase the temperature of the surrounding air in a 1 meter radius, or of the surface of an object you can touch, no greater than a human mass. You can use this to create fire.`,
		amplifiedDescription: `Five meter radius, or ten human masses.`,
		cost: { mana: 2 },
		drawbacks: [`You get burnt`],
		attributeId: "nature",
	},
	shapeWater: {
		name: "Shape Water",
		description: `Manipulate the shape or temperature of a body of water no greater than a human mass.`,
		amplifiedDescription: `Ten human masses.`,
		cost: { mana: 2 },
		drawbacks: [
			`You get frostbite`,
			`The water may take a different shape than intended`,
		],
		attributeId: "nature",
	},
	gust: {
		name: "Gust",
		description: `Create a strong gust of wind in a specified direction. It can be used to clear fog, extinguish small fires, or push objects away.`,
		amplifiedDescription: `Increase the wind's strength and range.`,
		cost: { mana: 3 },
		drawbacks: [`You are pushed in the opposite direction`],
		attributeId: "nature",
	},
	light: {
		name: "Light",
		description: `Generate a bright light in a specific area, illuminating the surroundings.`,
		amplifiedDescription: `Create multiple light sources.`,
		cost: { mana: 2 },
		drawbacks: [`You are temporarily blinded`],
		attributeId: "nature",
	},
	shapeMana: {
		name: "Shape Mana",
		description: `Manipulate the mana in the environment to create barriers, shields, projectiles, or other constructs no larger than a human mass.`,
		amplifiedDescription: `Shape larger and more intricate magical constructs.`,
		cost: { mana: 4 },
		drawbacks: [
			`Draining effect, leaving you magically weakened`,
			`May use more mana depending on the size and complexity of the construct`,
		],
		attributeId: "nature",
	},
	strengthen: {
		name: "Strengthen",
		description: `While concentrating, target receives +X to a category of your choice, where X is the number of successes.`,
		amplifiedDescription: `Double the bonus.`,
		cost: { mana: 3 },
		drawbacks: [`Target experiences fatigue afterward`],
		attributeId: "nature",
	},
	healing: {
		name: "Healing",
		description: `Remove X conditions from a target, where X is the number of successes.`,
		amplifiedDescription: `Multiple targets, or remove all conditions from one target.`,
		cost: { mana: 5 },
		drawbacks: [`Casting causes additional physical stress from exhaustion`],
		attributeId: "nature",
	},
	teleport: {
		name: "Teleport",
		description: `Instantaneously transport yourself or another object to a location within line of sight.`,
		amplifiedDescription: `Teleport to distant locations or across obstacles.`,
		cost: { mana: 6 },
		drawbacks: [`Potential disorientation upon arrival`],
		attributeId: "metaphysical",
	},
	gateway: {
		name: "Gateway",
		description: `Create a portal between two locations, allowing travel between them.`,
		amplifiedDescription: `Open gateways to other planes or dimensions.`,
		cost: { mana: 6 },
		castingTime: { turns: 1 },
		drawbacks: [
			`Portal may attract unwanted attention`,
			`The portal may be unstable or unpredictable`,
		],
		attributeId: "metaphysical",
	},
	imbue: {
		name: "Imbue",
		description: `Infuse an object with mana, activating its abilities or granting it temporary enchantments.`,
		amplifiedDescription: `Multiple objects`,
		cost: { mana: 4 },
		castingTime: { turns: 1 },
		drawbacks: [`Risk of unintended side effects`],
		attributeId: "metaphysical",
	},
	applyForce: {
		name: "Apply Force",
		description: `Exert a telekinetic force on an object no larger than a human mass.`,
		amplifiedDescription: `Ten human masses, or more precise control over smaller objects.`,
		cost: { mana: 3 },
		drawbacks: [`Mental strain and potential headaches`],
		attributeId: "metaphysical",
	},
	applyImpulse: {
		name: "Apply Impulse",
		description: `Impart a burst of kinetic energy on an object no larger than a human mass.`,
		amplifiedDescription: `Ten human masses, or multiple objects.`,
		cost: { mana: 4 },
		drawbacks: [`Difficulty controlling the trajectory`],
		attributeId: "metaphysical",
	},
	timeshift: {
		name: "Timeshift",
		description: `Temporarily manipulate the flow of time, allowing you to perceive events more quickly or slow down the world around you.`,
		amplifiedDescription: `Briefly alter the rate of time for a specific area or person.`,
		cost: { mana: 6, mentalStress: 1 },
		drawbacks: [`Temporal disorientation and fatigue`],
		attributeId: "metaphysical",
	},
	message: {
		name: "Message",
		description: `Telepathically communicate with another sentient being over a short distance.`,
		amplifiedDescription: `Establish mental communication over longer distances.`,
		cost: { mana: 2 },
		drawbacks: [`Risk of mental intrusion from other sources`],
		attributeId: "psychic",
	},
	calmEmotions: {
		name: "Calm Emotions",
		description: `Soothe and pacify the emotions of individuals in the spell's area of effect.`,
		amplifiedDescription: `Extend the calming effect to a larger crowd or area.`,
		cost: { mana: 3 },
		drawbacks: [`Emotional rebound, causing heightened emotions afterward`],
		attributeId: "psychic",
	},
	illusion: {
		name: "Illusion",
		description: `Create realistic illusions that can deceive the senses of sight, hearing, and touch, no larger than a human mass.`,
		amplifiedDescription: `Ten human masses, or more precise control over smaller illusions.`,
		cost: { mana: 4, mentalStress: 1 },
		drawbacks: [`Illusion may become unstable or reveal itself under scrutiny`],
		attributeId: "psychic",
	},
	identify: {
		name: "Identify",
		description: `Discern the properties, origin, and magical nature of objects or beings.`,
		amplifiedDescription: `Gain detailed knowledge and history of the target.`,
		cost: { mana: 3 },
		drawbacks: [`Temporary sensory overload and disorientation`],
		attributeId: "psychic",
	},
	dreamwalk: {
		name: "Dreamwalk",
		description: `Enter and explore the dreams of a sleeping individual.`,
		amplifiedDescription: `Influence or manipulate the dream realm.`,
		cost: { mana: 3, mentalStress: 1 },
		drawbacks: [`Risk of becoming trapped in the dream world temporarily`],
		attributeId: "psychic",
	},
	divination: {
		name: "Divination",
		description: `Gain insights into the future or uncover hidden information through magical means.`,
		amplifiedDescription: `Receive more detailed and specific visions.`,
		cost: { mana: 6, mentalStress: 2 },
		drawbacks: [`Mental fatigue and potential glimpses of unsettling visions`],
		attributeId: "psychic",
	},
	modifyMemory: {
		name: "Modify Memory",
		description: `Selectively change or erase a subject’s memory of a specific topic.`,
		amplifiedDescription: `Modify memories without limits.`,
		cost: { mana: 6, mentalStress: 4 },
		castingTime: { turns: 1 },
		drawbacks: [
			`The subject receives excessive stress`,
			`More than what was intended may be erased`,
		],
		attributeId: "taboo",
	},
	weaken: {
		name: "Weaken",
		description: `While concentrating, target receives -X to a category of your choice, where X is the number of successes.`,
		amplifiedDescription: `Double the penalty.`,
		cost: { mana: 4, mentalStress: 2 },
		drawbacks: [`Casting weakens the caster temporarily as well`],
		attributeId: "taboo",
	},
	lifesteal: {
		name: "Lifesteal",
		description: `While concentrating, every turn, caster heals 2 physical stress, while target receives +2 physical stress.`,
		amplifiedDescription: `Steal life force from multiple targets simultaneously.`,
		cost: { mana: 6, mentalStress: 2 },
		drawbacks: [`Potential corruption of the caster's own life force`],
		attributeId: "taboo",
	},
	darkness: {
		name: "Darkness",
		description: `Shroud an area in magical darkness, obscuring vision and creating an environment conducive to stealth.`,
		amplifiedDescription: `Imbue the darkness with supernatural properties or supplemental illusions`,
		cost: { mana: 3 },
		drawbacks: [`Momentary blindness upon dispelling the darkness`],
		attributeId: "taboo",
	},
	readThoughts: {
		name: "Read Thoughts",
		description: `Intrude into the minds of others to glean surface thoughts and emotions.`,
		amplifiedDescription: `Probe deeper into memories and hidden thoughts.`,
		cost: { mana: 5, mentalStress: 2 },
		drawbacks: [`Overwhelming influx of thoughts, causing mental strain`],
		attributeId: "taboo",
	},
	silence: {
		name: "Silence",
		description: `Create an area where all sound is muffled or suppressed, rendering it eerily quiet.`,
		amplifiedDescription: `Extend the silence to a larger area or make it absolute.`,
		cost: { mana: 3 },
		drawbacks: [`Momentary deafness upon dispelling the silence`],
		attributeId: "taboo",
	},
	despair: {
		name: "Despair",
		description: `Inflict a wave of overwhelming despair on individuals in the spell's area of effect.`,
		amplifiedDescription: `Intensify the despair, potentially causing temporary psychological trauma.`,
		cost: { mana: 5, mentalStress: 2 },
		drawbacks: [`Casting leaves the caster emotionally drained`],
		attributeId: "taboo",
	},
}
