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
			const homeTeam = {
				trainer: {
					name: team.trainer.name,
				},
				pokemons: team.pokemons.map(pokemon => {
					const validatedPokedexId = pokidexIdMustBeNumberFrom1to151({
						pokedexId: pokemon.pokedexId,
						onError: pushError,
					})
					return {
						pokedexId: validatedPokedexId,
						name: pokemon.name,
						types: pokemon.types,
						weaknesses: pokemon.weaknesses,
						multipliers: pokemon.multipliers,
						health: startHealth,
					}
				}),
			}

			if (!hasError()) {
				battleState.homeTeam = homeTeam
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

	return true
}
const isNonEmptyTrimmedString = <T>(val: unknown | T): val is string =>
	typeof val === 'string' && val.trim().length > 0

const pokidexIdMustBeNumberFrom1to151 = <T>({
	pokedexId,
	onError,
}: {
	pokedexId: T
	onError: (e: BattleError) => void
}) => {
	const isNumberFrom1to151String =
		typeof pokedexId === 'number' && pokedexId <= 151 && pokedexId >= 1

	if (!isNumberFrom1to151String) {
		onError({
			type: 'validation',
			message: 'PokidexId must be a number from 1 to 151',
		})
	}

	return pokedexId
}

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
