const startHealth = 1000

export const battle = () => {
	const battleState: BattleState = { ended: false }
	const errors: BattleError[] = []
	const hasError = () => errors.length > 0
	const pushError = (prefix: string) => (e: BattleError) =>
		errors.push({ ...e, message: [prefix, e.message].join(': ') })

	return {
		addHomeTeam(team: Team) {
			if (!isValidTeam(team, { onError: pushError('homeTeam') })) {
				return
			}

			if (
				battleState.awayTeam?.trainer &&
				team.trainer.name === battleState.awayTeam.trainer.name
			) {
				pushError('addHomeTeam')({
					message: 'trainer name is already in use in home team',
					type: 'forbidden',
				})
				return
			}

			if (!!battleState.homeTeam) {
				pushError('addHomeTeam')({
					message: 'team already exists',
					type: 'forbidden',
				})
				return
			}

			battleState.homeTeam = toBattleActiveTeam(team)
		},
		addAwayTeam(team: Team) {
			if (!isValidTeam(team, { onError: pushError('awayTeam') })) {
				return
			}

			if (!!battleState.awayTeam) {
				pushError('addAwayTeam')({
					message: 'team already exists',
					type: 'forbidden',
				})
				return
			}

			if (
				battleState.homeTeam?.trainer &&
				team.trainer.name === battleState.homeTeam.trainer.name
			) {
				pushError('addAwayTeam')({
					message: 'trainer name is already in use in home team',
					type: 'forbidden',
				})
				return
			}

			battleState.awayTeam = toBattleActiveTeam(team)
		},
		begin() {
			if (!battleState.homeTeam || !battleState.awayTeam) {
				pushError('begin')({
					message: 'battle must have two teams to begin',
					type: 'forbidden',
				})
				return
			}
		},
		get ended() {
			return battleState.ended
		},
		get hasError() {
			return hasError()
		},
		get errors() {
			return [...errors.map(e => ({ ...e }))]
		},
	}
}

const toBattleActiveTeam = (team: Team) => ({
	trainer: {
		name: team.trainer.name,
	},
	pokemons: team.pokemons.map(pokemon => {
		return {
			pokedexId: pokemon.pokedexId,
			name: pokemon.name,
			types: pokemon.types,
			weaknesses: pokemon.weaknesses || [],
			multipliers: pokemon.multipliers || [],
			health: startHealth,
		}
	}),
})

const isPartial = <T extends object>(val: unknown | T): val is Partial<T> =>
	typeof val === 'object' && val !== null && !(val instanceof Error)

const isValidTeam = (
	team: unknown,
	{
		onError,
	}: {
		onError?: (e: BattleError) => void
	} = {}
): team is Team => {
	if (!isPartial<Team>(team)) {
		onError?.({ type: 'validation', message: 'Team must be a object' })
		return false
	}

	if (!isPartial(team.trainer)) {
		onError?.({ type: 'validation', message: 'Trainer must be a object' })
		return false
	}

	if (!isNonEmptyTrimmedString(team.trainer.name)) {
		onError?.({
			type: 'validation',
			message: 'Trainer name must be a non empty string',
		})
		return false
	}

	if (!Array.isArray(team.pokemons)) {
		onError?.({
			type: 'validation',
			message: 'Team pokemons must be an array',
		})
		return false
	}

	if (team.pokemons.length !== 3) {
		onError?.({
			type: 'validation',
			message: 'Each team must have three pokemons',
		})
		return false
	}

	if (team.pokemons.some(pokemon => !isPartial(pokemon))) {
		onError?.({
			type: 'validation',
			message: 'Each team pokemon must be a object',
		})
		return false
	}

	if (team.pokemons.some(pokemon => !isNumberFrom1to151(pokemon.pokedexId))) {
		onError?.({
			type: 'validation',
			message: 'Each team pokemon pokedexId must be a number from 1 to 151',
		})
		return false
	}
	if (team.pokemons.some(pokemon => !Array.isArray(pokemon.types))) {
		onError?.({
			type: 'validation',
			message: 'Pokemon types field must be an array',
		})
		return false
	}

	if (team.pokemons.some(pokemon => pokemon.types.length < 1)) {
		onError?.({
			type: 'validation',
			message: 'Pokemon types field must have at least one type',
		})
		return false
	}

	if (team.pokemons.some(pokemon => !pokemon.types.every(isValidType))) {
		onError?.({
			type: 'validation',
			message: `Pokemon types field must only include the following types: ${validPokemonTypes.join(', ')}`,
		})
		return false
	}

	if (
		team.pokemons.some(
			pokemon =>
				!(Array.isArray(pokemon.weaknesses) || pokemon.weaknesses === undefined)
		)
	) {
		onError?.({
			type: 'validation',
			message: 'Optional Pokemon field weaknesses must be an array if defined',
		})
		return false
	}

	if (
		team.pokemons.some(
			pokemon => !!pokemon.weaknesses && !pokemon.weaknesses.every(isValidType)
		)
	) {
		onError?.({
			type: 'validation',
			message: `Pokemon weaknesses if defined must only include any of the following types: ${validPokemonTypes.join(', ')}`,
		})
		return false
	}

	if (
		team.pokemons.some(
			pokemon =>
				!(
					Array.isArray(pokemon.multipliers) ||
					pokemon.multipliers === undefined
				)
		)
	) {
		onError?.({
			type: 'validation',
			message:
				'Optional Pokemon field multipliers field must be an array if defined',
		})
		return false
	}

	if (
		team.pokemons.some(
			pokemon =>
				!!pokemon.multipliers &&
				!pokemon.multipliers.every(
					multiplier =>
						typeof multiplier === 'number' && multiplier > 0 && multiplier <= 5
				)
		)
	) {
		onError?.({
			type: 'validation',
			message:
				'If Pokemon multipliers is defined it must only include numbers between 0.001 and 5.000',
		})
		return false
	}

	return true
}

const validPokemonTypes = [
	'Grass',
	'Poison',
	'Fire',
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
]

const isValidType = <T>(val: unknown | T): val is string =>
	typeof val === 'string' && validPokemonTypes.includes(val)

const isNonEmptyTrimmedString = <T>(val: unknown | T): val is string =>
	typeof val === 'string' && val.trim().length > 0

const isNumberFrom1to151 = <T>(val: unknown | T): val is number =>
	typeof val === 'number' && val <= 151 && val >= 1

export interface BattleError {
	type: 'validation' | 'forbidden'
	message: string
}
export interface Team {
	trainer: Trainer
	pokemons: Pokemon[]
}

export interface Pokemon {
	name: string
	pokedexId: number
	multipliers?: number[]
	weaknesses?: string[]
	types: string[]
}

interface Trainer {
	name: string
}

interface BattleActivePokemon {
	name: string
	pokedexId: number
	multipliers: number[]
	weaknesses: string[]
	types: string[]
	health: number
}

interface BattleState {
	homeTeam?: { trainer?: Trainer; pokemons?: BattleActivePokemon[] }
	awayTeam?: { trainer?: Trainer; pokemons?: BattleActivePokemon[] }
	ended: boolean
}
