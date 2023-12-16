export interface DictionaryEntry {
	terms: string[]
	definition: string
}

export const dictionary: Record<string, DictionaryEntry> = {
	character: {
		terms: ["character"],
		definition: `A character is a fictional person or creature in a story.`,
	},
	playerCharacter: {
		terms: ["player character", "PC"],
		definition: `A player character is a character that is controlled by a player.`,
	},
	nonPlayerCharacter: {
		terms: ["non-player character", "NPC"],
		definition: `A non-player character is a character that is controlled by the game master.`,
	},
	archetype: {
		terms: ["archetype"],
		definition: `A category which describes the character's preferred way of interacting with the world around them. Different archetypes will boost different attributes in their corresponding category.`,
	},
	attribute: {
		terms: ["attribute"],
		definition: `A stat that describes a character's ability to perform a certain action.`,
	},
	action: {
		terms: ["action"],
		definition: `An action is a task that a character can perform.`,
	},
	actionRoll: {
		terms: ["action roll"],
		definition: `An action roll is a roll that determines the outcome of an action.`,
	},
}
