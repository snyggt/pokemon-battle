export const isNonEmptyTrimmedString = <T>(val: unknown | T): val is string =>
	typeof val === 'string' && val.trim().length > 0
