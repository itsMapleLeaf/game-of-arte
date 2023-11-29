export function toLowerCaseTyped<T extends string>(value: T): Lowercase<T> {
	return value.toLowerCase() as Lowercase<T>
}

export function toUpperCaseTyped<T extends string>(value: T): Uppercase<T> {
	return value.toUpperCase() as Uppercase<T>
}

export function plural(
	count: number,
	word: string,
	{
		pluralWord = `${word}s`,
		template = (count: number, word: string) => `${count} ${word}`,
	} = {},
) {
	return template(count, count === 1 ? word : pluralWord)
}
