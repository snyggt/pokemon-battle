export const isNumberFrom1to151 = <T>(val: unknown | T): val is number =>
	typeof val === 'number' && val <= 151 && val >= 1
