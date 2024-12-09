export const battle = () => {
	const battleState: BattleState = {
		ended: false,
		started: false,
	}
	const errors: BattleError[] = []

	const hasError = () => errors.length > 0

	const pushError = (prefix: string) => (e: BattleError) =>
		errors.push({ ...e, message: [prefix, e.message].join(': ') })

	const ended = () =>
		[
			hasPokemonLeft(battleState.awayTeam),
			hasPokemonLeft(battleState.homeTeam),
		].some(Boolean)

	const calculateDamage = () => 100

	return {
		addHomeTeam(team: Team) {
			const onError = pushError('homeTeam')
			if (!isValidTeam(team, { onError })) {
				return false
			}

			if (teamHaveSameTrainerName(battleState.awayTeam, team.trainer.name)) {
				onError({
					message: 'trainer name is already in use in away team',
					type: 'forbidden',
				})
				return false
			}

			if (battleState.homeTeam) {
				onError({
					message: 'team already exists',
					type: 'forbidden',
				})
				return false
			}

			battleState.homeTeam = toBattleActiveTeam(team)
		},

		addAwayTeam(team: Team) {
			const onError = pushError('awayTeam')

			if (!isValidTeam(team, { onError })) {
				return false
			}

			if (teamHaveSameTrainerName(battleState.homeTeam, team.trainer.name)) {
				onError({
					message: 'trainer name is already in use in home team',
					type: 'forbidden',
				})
				return false
			}

			if (battleState.awayTeam) {
				onError({
					message: 'team already exists',
					type: 'forbidden',
				})
				return false
			}

			battleState.awayTeam = toBattleActiveTeam(team)
		},

		begin() {
			const onError = pushError('begin')

			if (!battleState.homeTeam?.trainer || !battleState.awayTeam?.trainer) {
				onError({
					message: 'battle must have two teams to begin',
					type: 'forbidden',
				})
				return false
			}

			battleState.started = true
			battleState.turn = { count: 1, attacker: battleState.homeTeam.trainer }
		},

		selectTeam(trainerName: string) {
			const attackingTeam = [battleState.awayTeam, battleState.homeTeam].find(
				team => team?.trainer?.name === trainerName
			)
			const oponentTeam = [battleState.awayTeam, battleState.homeTeam].find(
				team => team?.trainer?.name !== trainerName
			)

			assert(attackingTeam, 'No attacking team found')
			assert(oponentTeam, 'No oponentTeam team found')
			return {
				attack: () => {
					const canAttack = [
						trainerName !== battleState.turn?.attacker.name,
						!ended(),
						attackingTeam,
						oponentTeam,
					].some(Boolean)

					if (!canAttack) {
						return false
					}

					const oponentPokemon = oponentTeam.pokemons.find(
						pokemon => pokemon.health > 0
					)

					const teamPokemon = attackingTeam.pokemons.find(
						pokemon => pokemon.health > 0
					)

					assert(battleState.turn, 'no turn found')
					assert(oponentPokemon, 'All oponent pokemons has fainted')
					assert(teamPokemon, 'All oponent pokemons has fainted')

					oponentPokemon.health -= calculateDamage()
					battleState.turn.count += 1
					battleState.turn.attacker = oponentTeam.trainer
				},
				get anyPokemonLeft() {
					const teamPokemon = attackingTeam.pokemons.find(
						pokemon => pokemon.health > 0
					)
					return !!teamPokemon
				},
				get teamPokemonHealth() {
					const teamPokemon = attackingTeam.pokemons.find(
						pokemon => pokemon.health > 0
					)
					return teamPokemon?.health ?? 0
				},
				get oponentPokemonHealth() {
					const oponentPokemon = oponentTeam.pokemons.find(
						pokemon => pokemon.health > 0
					)
					return oponentPokemon?.health ?? 0
				},
			}
		},
		get started() {
			return battleState.started
		},
		get ended() {
			return ended()
		},
		get currentTurn() {
			assert(battleState.turn, 'Turn not available until battle is started')
			return battleState.turn?.count ?? 0
		},
		get currentAttackingTrainer() {
			assert(
				battleState.turn,
				'Attacking trainer not available until battle is started'
			)
			return battleState.turn.attacker.name
		},
		get hasError() {
			return hasError()
		},
		get errors() {
			return [...errors.map(e => ({ ...e }))]
		},
	}
}

function assert(condition: unknown, message: string): asserts condition {
	if (!condition) {
		throw new Error(message)
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

const startHealth = 1000

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

const hasPokemonLeft = (team: BattleTeam | undefined) =>
	team?.pokemons.some(p => p.health > 0)

const teamHaveSameTrainerName = (
	battleTeam: BattleTeam | undefined,
	trainerName: string
) => battleTeam?.trainer && trainerName === battleTeam.trainer.name

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

type BattleTeam = { trainer: Trainer; pokemons: BattleActivePokemon[] }

interface BattleState {
	homeTeam?: BattleTeam
	awayTeam?: BattleTeam
	ended: boolean
	turn?: { count: number; attacker: Trainer }
	started: boolean
}
