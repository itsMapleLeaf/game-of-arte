import { twStyle } from "./twStyle.ts"

export const radixAnimationFade = twStyle(
	"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in",
)

export const radixAnimationSlideBottom = twStyle(
	"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2",
)
