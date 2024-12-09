export const battle = () => {
	const startHealth = 1000
	const battleState: BattleState = { gameCompleted: false }
	const errors: BattleError[] = []
	const hasError = () => errors.length > 0
	const pushError = (e: BattleError) => errors.push(e)

	return {
		addHomeTeam(team: Team) {
			if (!isValidTeam(team, { onError: pushError })) {
				return
			}

			if (!hasError()) {
				battleState.homeTeam = {
					trainer: {
						name: team.trainer.name,
					},
					pokemons: team.pokemons.map(pokemon => {
						return {
							pokedexId: pokemon.pokedexId,
							name: pokemon.name,
							types: pokemon.types,
							weaknesses: pokemon.weaknesses,
							multipliers: pokemon.multipliers,
							health: startHealth,
						}
					}),
				}
			}
		},
		get gameCompleted() {
			return battleState.gameCompleted
		},
		get hasError() {
			return hasError()
		},
		get errors() {
			return [...errors.map(e => ({ ...e }))]
		},
	}
}

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
	return true
}

const isNonEmptyTrimmedString = <T>(val: unknown | T): val is string =>
	typeof val === 'string' && val.trim().length > 0

const isNumberFrom1to151 = <T>(val: unknown | T): val is number =>
	typeof val === 'number' && val <= 151 && val >= 1

export interface BattleError {
	type: 'validation'
	message: string
}
export interface Team {
	trainer: Trainer
	pokemons: Pokemon[]
}

export interface Pokemon {
	name: string
	pokedexId: number
	multipliers: number[]
	weaknesses: string[]
	types: string[]
}

interface Trainer {
	name: string
}

interface BattleActivePokemon extends Pokemon {
	health: number
}

interface BattleState {
	homeTeam?: { trainer?: Trainer; pokemons?: BattleActivePokemon[] }
	awayTeam?: { trainer?: Trainer; pokemons?: BattleActivePokemon[] }
	gameCompleted: boolean
}
