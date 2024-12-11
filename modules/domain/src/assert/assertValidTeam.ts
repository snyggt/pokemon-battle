import { isNonEmptyTrimmedString } from '../guards/isNonEmptyTrimmedString'
import { isNumberFrom1to151 } from '../guards/isNumberFrom1to151'
import { isPartial } from '../guards/isPartial'
import { isValidType, validPokemonTypes } from '../guards/isValidType'
import { TeamDto } from '../models/Team'
import { assert } from '.'

export function assertValidTeam(team: unknown): asserts team is TeamDto {
	assert(isPartial<TeamDto>(team), 'Team must be a object')
	assert(isPartial(team.trainer), 'Trainer must be a object')

	assert(
		isNonEmptyTrimmedString(team.trainer.name),
		'Trainer name must be a non empty string'
	)
	assert(Array.isArray(team.pokemons), 'Team pokemons must be an array')

	assert(team.pokemons.length === 3, 'Each team must have three pokemons')

	assert(
		team.pokemons.every(pokemon => isPartial(pokemon)),
		'Each team pokemon must be a object'
	)

	assert(
		team.pokemons.every(pokemon => isNumberFrom1to151(pokemon.pokedexId)),
		'Each team pokemon pokedexId must be a number from 1 to 151'
	)

	assert(
		team.pokemons.every(pokemon => Array.isArray(pokemon.types)),
		'Pokemon types field must be an array'
	)

	assert(
		team.pokemons.every(pokemon => pokemon.types.length > 0),
		'Pokemon types field must have at least one type'
	)

	assert(
		team.pokemons.every(pokemon => pokemon.types.every(isValidType)),
		`Pokemon types field must only include the following types: ${validPokemonTypes.join(', ')}`
	)
	assert(
		team.pokemons.every(
			pokemon =>
				Array.isArray(pokemon.weaknesses) || pokemon.weaknesses === undefined
		),
		'Optional Pokemon field weaknesses must be an array if defined'
	)

	assert(
		team.pokemons.every(
			pokemon => !pokemon.weaknesses || pokemon.weaknesses.every(isValidType)
		),
		`Pokemon weaknesses if defined must only include any of the following types: ${validPokemonTypes.join(', ')}`
	)

	assert(
		team.pokemons.every(
			pokemon =>
				Array.isArray(pokemon.multipliers) || pokemon.multipliers === undefined
		),
		'Optional Pokemon field multipliers field must be an array if defined'
	)

	assert(
		team.pokemons.every(
			pokemon =>
				!pokemon.multipliers ||
				pokemon.multipliers.every(
					multiplier =>
						typeof multiplier === 'number' && multiplier > 0 && multiplier <= 12
				)
		),
		'If Pokemon multipliers is defined it must only include numbers between 0.001 and 12.000'
	)
}
