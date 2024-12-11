export const isPartial = <T extends object>(
	val: unknown | T
): val is Partial<T> =>
	typeof val === 'object' && val !== null && !(val instanceof Error)
