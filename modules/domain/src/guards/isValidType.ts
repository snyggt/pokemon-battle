export const isValidType = <T>(val: unknown | T): val is string =>
	typeof val === 'string' && validPokemonTypes.includes(val)

export const validPokemonTypes = [
	'Grass',
	'Poison',
	'Fire',
	'Fairy',
	'Flying',
	'Water',
	'Bug',
	'Normal',
	'Electric',
	'Ground',
	'Fighting',
	'Psychic',
	'Rock',
	'Ice',
	'Ghost',
	'Dragon',
	'Dark',
	'Steel',
]
