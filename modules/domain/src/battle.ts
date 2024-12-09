import { panic } from './errorHandling'

export const battle = () => {
	const battleState: BattleState = {
		ended: false,
		started: false,
		awayTeam: undefined,
		homeTeam: undefined,
		turn: undefined,
	}

	const ended = () =>
		[
			!hasPokemonLeft(battleState.awayTeam),
			!hasPokemonLeft(battleState.homeTeam),
		].some(Boolean)

	return {
		addHomeTeam(team: Team) {
			assertValidTeam(team)

			assertTeamsHaveDifferentTrainerNames(
				battleState.awayTeam,
				team.trainer.name
			)

			assert(!battleState.homeTeam, 'Home team cannot be added twise')

			battleState.homeTeam = toBattleActiveTeam(team)
		},

		addAwayTeam(team: Team) {
			assertValidTeam(team)

			assertTeamsHaveDifferentTrainerNames(
				battleState.homeTeam,
				team.trainer.name
			)

			assert(!battleState.awayTeam, 'Away team cannot be added twise')

			battleState.awayTeam = toBattleActiveTeam(team)
		},

		begin() {
			assert(
				battleState.awayTeam && battleState.homeTeam,
				'Battle must have two teams to begin'
			)

			battleState.started = true
			battleState.turn = { count: 1, attacker: battleState.homeTeam.trainer }
		},

		selectTeam(trainerName: string) {
			assert(battleState.started, 'Game must start before running team actions')
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
					assert(
						trainerName === battleState.turn?.attacker.name,
						'Trainer can only attack on its teams turn'
					)
					assert(!ended(), 'Trainer cannot attack if battle has ended')

					const oponentPokemon = oponentTeam.pokemons.find(
						pokemon => pokemon.health > 0
					)

					const teamPokemon = attackingTeam.pokemons.find(
						pokemon => pokemon.health > 0
					)

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
			return battleState.turn.count
		},
		get currentAttackingTrainer() {
			return battleState.turn?.attacker.name
		},
	}
}

export function assert(condition: unknown, message: string): asserts condition {
	if (!condition) {
		panic(message, { removeCallerFromStack: true })
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

function assertTeamsHaveDifferentTrainerNames(
	battleTeam: BattleTeam | undefined,
	trainerName: string
) {
	assert(
		!battleTeam?.trainer || trainerName !== battleTeam.trainer.name,
		'Team trainers must have different trainer names'
	)
}

function assertValidTeam(team: unknown): asserts team is Team {
	assert(isPartial<Team>(team), 'Team must be a object')
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
						typeof multiplier === 'number' && multiplier > 0 && multiplier <= 5
				)
		),
		'If Pokemon multipliers is defined it must only include numbers between 0.001 and 5.000'
	)
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

const calculateDamage = () => 100

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
