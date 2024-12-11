import { randomUUID } from 'crypto'

import { assert } from './assert'
import { assertValidTeam } from './assert/assertValidTeam'
import { assertTeamsHaveDifferentTrainerNames } from './assert/assertTeamHaveDifferentTrainerNames'

import { TeamType } from './models/TeamType'
import { TeamDto } from './models/Team'
import { BattleTeam } from './models/BattleTeam'
import { BattleActivePokemon } from './models/BattleActivePokemon'
import { BattleState } from './models/BattleState'
import { BattleActiveTeam } from './models/BattleActiveTeam'

import { TeamJoinedEvent } from './events/TeamJoinedEvent'
import { createEventEnveloper } from './events/createEventEnveloper'
import { EventEnvelope } from './events/EventEnvelope'
import { BattleEvent } from './events/BattleEvent'
import { StartedEvent } from './events/StartedEvent'
import { AttackedEvent } from './events/AttackedEvent'
import { EndedEvent } from './events/EndedEvent'

import { START_HEALTH } from './constants'

export const battle = () => {
	const battleState: BattleState = {
		id: randomUUID(),
		started: false,
		turn: undefined,
	}

	const lookups: Lookups = {
		pokemonsById: new Map<string, BattleActivePokemon>(),
		teamByTrainerName: new Map<string, TeamType>(),
		pokemonsByTeam: new Map<TeamType, BattleActivePokemon[]>(),
		trainerNameByTeam: new Map<TeamType, string>(),
	}

	const { pokemonsByTeam, teamByTrainerName, trainerNameByTeam } = lookups
	const events: EventEnvelope<BattleEvent>[] = []
	const addWithEnvelope = createEventEnveloper(events)

	return {
		addHomeTeam(team: TeamDto) {
			assertValidTeam(team)
			const awayTrainer = trainerNameByTeam.get('awayTeam')
			assertTeamsHaveDifferentTrainerNames(awayTrainer, team.trainer.name)
			assert(
				!teamByTrainerName.get(team.trainer.name),
				'Home team cannot be added twise'
			)

			const battleActiveTeam = toBattleActiveTeam(team, 'homeTeam')

			addToLookups(battleActiveTeam, 'homeTeam', lookups)

			addWithEnvelope<TeamJoinedEvent>({
				type: 'team-joined',
				payload: {
					teamType: 'homeTeam',
					pokemons: battleActiveTeam.pokemons,
					trainer: battleActiveTeam.trainer,
				},
			})
		},

		addAwayTeam(team: TeamDto) {
			assertValidTeam(team)
			const homeTrainer = trainerNameByTeam.get('homeTeam')
			const awayTrainer = trainerNameByTeam.get('awayTeam')
			assertTeamsHaveDifferentTrainerNames(homeTrainer, team.trainer.name)
			assert(!awayTrainer, 'Away team cannot be added twise')

			const battleTeam = toBattleActiveTeam(team, 'awayTeam')
			addToLookups(battleTeam, 'awayTeam', lookups)

			addWithEnvelope<TeamJoinedEvent>({
				type: 'team-joined',
				payload: {
					teamType: 'awayTeam',
					pokemons: battleTeam.pokemons,
					trainer: battleTeam.trainer,
				},
			})
		},

		begin() {
			const awayTeam = pokemonsByTeam.get('awayTeam')
			const homeTeam = pokemonsByTeam.get('homeTeam')

			assert(homeTeam && awayTeam, 'Battle must have two teams to begin')

			battleState.started = true
			battleState.turn = {
				count: 1,
				attackingTeaam: 'homeTeam',
			}

			addWithEnvelope<StartedEvent>({
				type: 'started',
				payload: {
					battleState: {
						...battleState,
						turn: {
							count: 1,
							attackingTeaam: 'homeTeam',
						},
					},
					awayTeam: [...awayTeam],
					homeTeam: [...homeTeam],
				},
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
			return ended(pokemonsByTeam)
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

			const teamType = teamByTrainerName.get(trainerName)
			assert(teamType, 'No teamType found')

			const attackingTeam = pokemonsByTeam.get(teamType)
			const oponentTeam = pokemonsByTeam.get(
				teamType === 'homeTeam' ? 'awayTeam' : 'homeTeam'
			)

			assert(attackingTeam, 'No attacking team found')
			assert(oponentTeam, 'No oponentTeam team found')

			return {
				attack: createAttackFunction(
					teamType,
					battleState,
					oponentTeam,
					attackingTeam,
					addWithEnvelope,
					lookups
				),
			}
		},
	}
}

const createAttackFunction =
	(
		team: TeamType,
		battleState: BattleState,
		oponentPokemons: BattleActivePokemon[],
		attackingPokemons: BattleActivePokemon[],
		addWithEnvelope: ReturnType<typeof createEventEnveloper>,
		{ pokemonsByTeam }: Lookups
	) =>
	() => {
		assert(
			team === battleState.turn?.attackingTeaam,
			'Trainer can only attack on its teams turn'
		)
		assert(!ended(pokemonsByTeam), 'Trainer cannot attack if battle has ended')

		const oponentHealthyPokemon = oponentPokemons.find(
			pokemon => pokemon.health > 0
		)

		const attackingHealthyPokemon = attackingPokemons.find(
			pokemon => pokemon.health > 0
		)

		assert(oponentHealthyPokemon, 'All oponent pokemons has fainted')
		assert(attackingHealthyPokemon, 'All oponent pokemons has fainted')
		assert(battleState.turn, 'All oponent pokemons has fainted')

		const damage = calculateDamage(
			oponentHealthyPokemon,
			attackingHealthyPokemon
		)
		const calculatedDamage = Math.min(oponentHealthyPokemon.health, damage)

		oponentHealthyPokemon.health -= calculatedDamage
		battleState.turn.count += 1
		battleState.turn.attackingTeaam = oponentHealthyPokemon.teamType

		addWithEnvelope<AttackedEvent>({
			type: 'attacked',
			payload: {
				damage: calculatedDamage,
				turn: battleState.turn.count,
				attackedPokemon: { ...oponentHealthyPokemon },
				attackedByPokemon: { ...attackingHealthyPokemon },
			},
		})

		if (ended(pokemonsByTeam)) {
			const homeTeam = pokemonsByTeam.get('homeTeam')
			const awayTeam = pokemonsByTeam.get('awayTeam')
			assert(homeTeam, 'No homeTeam found')
			assert(awayTeam, 'No awayTeam found')
			addWithEnvelope<EndedEvent>({
				type: 'ended',
				payload: {
					battleState,
					homeTeam,
					awayTeam,
				},
			})
		}
	}

const toBattleActiveTeam = (
	team: TeamDto,
	teamType: 'homeTeam' | 'awayTeam'
) => ({
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
			health: START_HEALTH,
		}
	}),
})

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

const addToLookups = (
	battleTeam: BattleTeam,
	teamType: TeamType,
	{
		pokemonsById,
		pokemonsByTeam,
		teamByTrainerName,
		trainerNameByTeam,
	}: Lookups
) => {
	pokemonsByTeam.set(teamType, battleTeam.pokemons)
	teamByTrainerName.set(battleTeam.trainer.name, teamType)
	pokemonsByTeam.set(teamType, battleTeam.pokemons)
	trainerNameByTeam.set(teamType, battleTeam.trainer.name)
	battleTeam.pokemons.forEach(pokemon => pokemonsById.set(pokemon.id, pokemon))
}

const ended = (pokemonsByTeam: Map<TeamType, BattleActiveTeam>) =>
	[
		!hasPokemonLeft(pokemonsByTeam.get('awayTeam')),
		!hasPokemonLeft(pokemonsByTeam.get('homeTeam')),
	].some(Boolean)

export const isBattleEvent = <T extends BattleEvent['type']>(
	e: EventEnvelope<BattleEvent>,
	type: T
): e is EventEnvelope<Extract<BattleEvent, { type: T }>> => {
	return e.type === type
}

interface Lookups {
	pokemonsById: Map<string, BattleActivePokemon>
	teamByTrainerName: Map<string, TeamType>
	pokemonsByTeam: Map<TeamType, BattleActiveTeam>
	trainerNameByTeam: Map<TeamType, string>
}
