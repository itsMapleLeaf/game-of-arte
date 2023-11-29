import type { Doc } from "convex/_generated/dataModel.js"
import { createSimpleContext } from "~/helpers/context.tsx"

export const CharacterContext =
	createSimpleContext<Doc<"characters">>("CharacterContext")
