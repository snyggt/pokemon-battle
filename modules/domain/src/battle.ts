import { randomUUID } from 'crypto'
import { panic } from './errorHandling'

export const battle = () => {
	const battleState: BattleState = {
		id: randomUUID(),
		started: false,
		turn: undefined,
	}
	const pokemonsById = new Map<string, BattleActivePokemon>()
	const teamByTrainerName = new Map<string, TeamType>()
	const pokemonsByTeam = new Map<TeamType, BattleActivePokemon[]>()
	const trainerNameByTeam = new Map<TeamType, string>()

	const events: EventEnvelope<BattleEvent>[] = []
	const addEvent = <T extends BattleEvent>(e: T) => {
		const eventEnvelope: EventEnvelope<T> = Object.freeze({
			type: e.type,
			payload: Object.freeze({ ...e.payload }),
			id: randomUUID(),
			revision: events.length + 1,
			timestamp: new Date(),
		})

		events.push(eventEnvelope)
	}

	const ended = () =>
		[
			!hasPokemonLeft(pokemonsByTeam.get('awayTeam')),
			!hasPokemonLeft(pokemonsByTeam.get('homeTeam')),
		].some(Boolean)

	return {
		addHomeTeam(team: Team) {
			assertValidTeam(team)
			const awayTrainer = trainerNameByTeam.get('awayTeam')
			assertTeamsHaveDifferentTrainerNames(awayTrainer, team.trainer.name)
			assert(
				!teamByTrainerName.get(team.trainer.name),
				'Home team cannot be added twise'
			)

			const battleTeam = toBattleActiveTeam(team, 'homeTeam')

			pokemonsByTeam.set('homeTeam', battleTeam.pokemons)
			trainerNameByTeam.set('homeTeam', battleTeam.trainer.name)
			teamByTrainerName.set(battleTeam.trainer.name, 'homeTeam')
			battleTeam.pokemons.forEach(pokemon =>
				pokemonsById.set(pokemon.id, pokemon)
			)

			addEvent<TeamJoinedEvent>({
				type: 'team-joined',
				payload: {
					teamType: 'homeTeam',
					pokemons: battleTeam.pokemons,
					trainer: battleTeam.trainer,
				},
			})
		},

		addAwayTeam(team: Team) {
			assertValidTeam(team)
			const homeTrainer = trainerNameByTeam.get('homeTeam')
			const awayTrainer = trainerNameByTeam.get('awayTeam')
			assertTeamsHaveDifferentTrainerNames(homeTrainer, team.trainer.name)
			assert(!awayTrainer, 'Away team cannot be added twise')

			const battleTeam = toBattleActiveTeam(team, 'awayTeam')

			pokemonsByTeam.set('awayTeam', battleTeam.pokemons)
			teamByTrainerName.set(battleTeam.trainer.name, 'awayTeam')
			pokemonsByTeam.set('awayTeam', battleTeam.pokemons)
			trainerNameByTeam.set('awayTeam', battleTeam.trainer.name)
			battleTeam.pokemons.forEach(pokemon =>
				pokemonsById.set(pokemon.id, pokemon)
			)

			addEvent<TeamJoinedEvent>({
				type: 'team-joined',
				payload: {
					teamType: 'awayTeam',
					pokemons: battleTeam.pokemons,
					trainer: battleTeam.trainer,
				},
			})
		},

		begin() {
			assert(pokemonsByTeam.size === 2, 'Battle must have two teams to begin')
			const awayTeam = pokemonsByTeam.get('awayTeam')
			const homeTeam = pokemonsByTeam.get('homeTeam')
			assert(homeTeam, 'Home team missing')
			assert(awayTeam, 'Away team missing')

			battleState.started = true
			battleState.turn = {
				count: 1,
				attackingTeaam: 'homeTeam',
			}

			addEvent<StartedEvent>({
				type: 'started',
				payload: { battleState, awayTeam, homeTeam },
			})
		},

		get events() {
			return events.map(e =>
				Object.freeze({
					...e,
					payload: Object.freeze({ ...e.payload }),
				})
			)
		},
		get started() {
			return battleState.started
		},
		get ended() {
			return ended()
		},
		get battleScores() {
			assert(
				battleState.started,
				'Game must start before checking battle scores'
			)
			const homeTeam = pokemonsByTeam.get('homeTeam')
			const awayTeam = pokemonsByTeam.get('awayTeam')
			assert(homeTeam, 'No homeTeam found')
			assert(awayTeam, 'No awayTeam found')
			return {
				ended: ended(),
				homeTeam: getTeamSnapshot(homeTeam),
				awayTeam: getTeamSnapshot(awayTeam),
			}
		},
		get currentTurn() {
			assert(battleState.turn, 'Turn not available until battle is started')
			return battleState.turn.count
		},
		get currentAttackingTeam() {
			return battleState.turn?.attackingTeaam
		},
		selectTeam(trainerName: string) {
			assert(battleState.started, 'Game must start before running team actions')
			const team = teamByTrainerName.get(trainerName)
			assert(team, 'No team found')
			const attackingTeam = pokemonsByTeam.get(team)

			const oponentTeam = pokemonsByTeam.get(
				team === 'homeTeam' ? 'awayTeam' : 'homeTeam'
			)

			assert(attackingTeam, 'No attacking team found')
			assert(oponentTeam, 'No oponentTeam team found')

			return {
				attack() {
					assert(
						team === battleState.turn?.attackingTeaam,
						'Trainer can only attack on its teams turn'
					)
					assert(!ended(), 'Trainer cannot attack if battle has ended')

					const oponentHealthyPokemon = oponentTeam.find(
						pokemon => pokemon.health > 0
					)

					const attackingHealthyPokemon = attackingTeam.find(
						pokemon => pokemon.health > 0
					)

					assert(oponentHealthyPokemon, 'All oponent pokemons has fainted')
					assert(attackingHealthyPokemon, 'All oponent pokemons has fainted')
					assert(battleState.turn, 'All oponent pokemons has fainted')

					const damage = calculateDamage(
						oponentHealthyPokemon,
						attackingHealthyPokemon
					)
					const calculatedDamage = Math.min(
						oponentHealthyPokemon.health,
						damage
					)

					oponentHealthyPokemon.health -= calculatedDamage
					battleState.turn.count += 1
					battleState.turn.attackingTeaam = oponentHealthyPokemon.teamType

					addEvent<AttackedEvent>({
						type: 'attacked',
						payload: {
							damage: calculatedDamage,
							turn: battleState.turn.count,
							attackedPokemon: { ...oponentHealthyPokemon },
							attackedByPokemon: { ...attackingHealthyPokemon },
						},
					})

					if (ended()) {
						const homeTeam = pokemonsByTeam.get('homeTeam')
						const awayTeam = pokemonsByTeam.get('awayTeam')
						assert(homeTeam, 'No homeTeam found')
						assert(awayTeam, 'No awayTeam found')
						addEvent<EndedEvent>({
							type: 'ended',
							payload: {
								battleState,
								homeTeam,
								awayTeam,
							},
						})
					}
				},
			}
		},
	}
}

export function assert(condition: unknown, message: string): asserts condition {
	if (!condition) {
		panic(message, { removeCallerFromStack: true })
	}
}

const toBattleActiveTeam = (team: Team, teamType: 'homeTeam' | 'awayTeam') => ({
	trainer: {
		name: team.trainer.name,
	},
	pokemons: team.pokemons.map(pokemon => {
		return {
			pokedexId: pokemon.pokedexId,
			id: randomUUID(),
			name: pokemon.name,
			teamType,
			trainerName: team.trainer.name,
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
	firstTrainerName: string | undefined,
	sedcondTrainerName: string
) {
	assert(
		!firstTrainerName || sedcondTrainerName !== firstTrainerName,
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

const getTeamSnapshot = (pokemons: BattleActivePokemon[]) =>
	Object.freeze({
		...pokemons,
		pokemons: pokemons?.map(pokemon => Object.freeze({ ...pokemon })),
		activePokemon: Object.freeze({
			...pokemons?.find(p => p.health > 0),
		}),
	})

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

const hasPokemonLeft = (pokemons: BattleActivePokemon[] | undefined) =>
	pokemons?.some(p => p.health > 0)

const calculateDamage = (
	oponent: BattleActivePokemon,
	attacker: BattleActivePokemon
) => {
	const BASE_DAMAGE = 100
	const BASE_MULTIPLIER_DAMAGE = 20
	const damageAfterMultipliers = attacker.multipliers.reduce(
		(totalDamage, multiplier) => {
			return totalDamage + multiplier * BASE_MULTIPLIER_DAMAGE
		},
		BASE_DAMAGE
	)
	const numberOfWeaknesses = new Set(
		oponent.weaknesses.filter(weaknes => attacker.types.includes(weaknes))
	).size

	return Math.round(damageAfterMultipliers * (1 + 1.1 * numberOfWeaknesses))
}

interface EventBase {
	type: string
	payload: Record<string, unknown>
}

export interface EventEnvelope<T extends EventBase> {
	id: string
	timestamp: Date
	revision: number
	payload: T['payload']
	type: T['type']
}

export type BattleEvent =
	| AttackedEvent
	| StartedEvent
	| TeamJoinedEvent
	| EndedEvent

export interface EndedEvent extends EventBase {
	type: 'ended'
	payload: {
		battleState: BattleState
		homeTeam: BattleActivePokemon[]
		awayTeam: BattleActivePokemon[]
	}
}

export interface AttackedEvent extends EventBase {
	type: 'attacked'
	payload: {
		attackedPokemon: BattleActivePokemon
		attackedByPokemon: BattleActivePokemon
		damage: number
		turn: number
	}
}

export interface TeamJoinedEvent extends EventBase {
	type: 'team-joined'
	payload: {
		teamType: TeamType
		pokemons: BattleActivePokemon[]
		trainer: Trainer
	}
}

export interface StartedEvent extends EventBase {
	type: 'started'
	payload: {
		battleState: BattleState
		homeTeam: BattleActivePokemon[]
		awayTeam: BattleActivePokemon[]
	}
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
	trainerName: string
	teamType: TeamType
	id: string
	pokedexId: number
	multipliers: number[]
	weaknesses: string[]
	types: string[]
	health: number
}

type TeamType = 'homeTeam' | 'awayTeam'

interface BattleState {
	id: string
	turn?: { count: number; attackingTeaam: TeamType }
	started: boolean
}
