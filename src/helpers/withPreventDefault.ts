export function withPreventDefault<
	Args extends [{ preventDefault(): void }, ...unknown[]],
	Return,
>(callback: (...args: Args) => Return) {
	return (...args: Args) => {
		args[0].preventDefault()
		return callback(...args)
	}
}
