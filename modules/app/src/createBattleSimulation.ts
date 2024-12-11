import { rethrow } from './errorHandling/rethrow'
import {
	battle,
	Team,
	assert,
	BattleEvent,
	EventEnvelope,
	isBattleEvent,
} from '@snyggt/pokemon-battle-domain/src/battle'

type CreateBattleSimulationResult =
	| CreateBattleSimulationSuccess
	| CreateBattleSimulationError

export interface CreateBattleSimulationSuccess {
	status: 'success'
	battleLog: BattleLogRecord[]
}

export interface CreateBattleSimulationError {
	status: 'error'
	message: string
	validationErrors: string[]
}

export const createBattleSimulationHandler = (services: Services) =>
	async function createBattleSimulationHandler(
		command: CreateBattleSimulationCommand
	): Promise<CreateBattleSimulationResult> {
		const teams = await resolveTeams({ command, services }).catch(
			rethrow('Unexpected error calling resolveTeams')
		)

		const pokemonBattle = battle()

		await runSimulation({
			battleSimulation: pokemonBattle,
			teams,
			maxNumberOfTurns: 200,
		}).catch(rethrow('Unexpected error calling runSimulation'))

		return {
			battleLog: generateBattleLog(pokemonBattle.events),
			status: 'success',
		}
	}

const isBattleLog = (
	possibleRecord: Partial<BattleLogRecord> | undefined
): possibleRecord is BattleLogRecord =>
	Boolean(possibleRecord?.details && possibleRecord.title)

const generateBattleLog = (events: EventEnvelope<BattleEvent>[]) =>
	events
		.map(e => {
			if (isBattleEvent(e, 'team-joined')) {
				const {
					teamType,
					trainer: { name },
					pokemons,
				} = e.payload

				return {
					title: `Trainer ${name} with pokémons ${pokemons.map(p => p.name).join(', ')} joined ${teamType}`,
					details: [
						'Pokémon info:',
						...pokemons.map(
							pokemon =>
								`${pokemon.name} (#${pokemon.pokedexId}); types: ${pokemon.types.join(', ')}; weaknesses: ${pokemon.weaknesses.join(', ')}`
						),
					],
					turn: 0,
				}
			}
			if (isBattleEvent(e, 'started')) {
				const { homeTeam, awayTeam, battleState } = e.payload
				const [homePokemon1] = homeTeam
				const [awayPokemon1] = awayTeam

				return {
					title: `Battle with id ${e.payload.battleState.id} started`,
					details: [
						`Turn 1 begins with trainer '${homePokemon1.trainerName}' with choosen pokémon '${homePokemon1.name}' VS. trainer '${awayPokemon1.trainerName}' with choosen pokémon '${awayPokemon1.name}'`,
					],
					turn: battleState.turn?.count,
				}
			}

			if (isBattleEvent(e, 'attacked')) {
				const { attackedPokemon, attackedByPokemon, damage, turn } = e.payload
				const {
					health,
					name: defendingPokemon,
					weaknesses,
					trainerName: defendingTrainer,
				} = attackedPokemon
				const { name: attacker, types, trainerName } = attackedByPokemon

				const matchingWeaknesses = weaknesses.filter(weakness =>
					types.includes(weakness)
				)
				const weaknessesInformation = matchingWeaknesses.length
					? `is weak against`
					: 'has no weaknesses against'

				return {
					title: `Trainer '${trainerName}' with pokémon '${attacker}' deals ${damage} damage to trainer '${defendingTrainer}s' pokémon '${defendingPokemon}' resulting in ${health} health left'`,
					details: [
						`Defending Pokémon '${defendingPokemon}' ${weaknessesInformation} Pokémon '${attacker}'`,
					],
					turn: turn,
				}
			}

			if (isBattleEvent(e, 'ended')) {
				const { homeTeam, awayTeam, battleState } = e.payload
				const [homePokemon1] = homeTeam
				const [awayPokemon1] = awayTeam
				const homeTeamNumberOfPokemonsLeft = homeTeam.filter(
					pokemon => pokemon.health > 0
				)
				const awayTeamNumberOfPokemonsLeft = awayTeam.filter(
					pokemon => pokemon.health > 0
				)

				const winningTrainer = homeTeamNumberOfPokemonsLeft.length
					? homePokemon1.trainerName
					: awayPokemon1.trainerName
				const pokemonsLeft = homeTeamNumberOfPokemonsLeft.length
					? homeTeamNumberOfPokemonsLeft
					: awayTeamNumberOfPokemonsLeft

				return {
					title: `Battle with id ${e.payload.battleState.id} ended with winner ${winningTrainer}! Pokémons '${pokemonsLeft.map(p => p.name).join(', ')}' still standing strong!`,
					details: [`The battle lasted ${battleState.turn?.count} turns`],
					turn: battleState.turn?.count ?? -1,
				}
			}

			return undefined
		})
		.filter(isBattleLog)

const extractUniquePokemonIds = ({
	awayTeam,
	homeTeam,
}: CreateBattleSimulationCommand) => {
	const allPokemonIds = [...awayTeam.pokemons, ...homeTeam.pokemons].flatMap(
		pokemon => pokemon
	)
	const uniquePokemonIds = new Set(allPokemonIds)
	return [...uniquePokemonIds]
}

const resolveTeam = ({
	team,
	pokemons,
	trainerName,
}: {
	trainerName: string
	team: TeamDto
	pokemons: Pokemon[]
}) => {
	return {
		trainer: { name: trainerName },
		pokemons: team.pokemons.map(pokemonId => {
			const pokemon = pokemons.find(pokmeon => pokmeon.pokedexId === pokemonId)

			assert(pokemon, 'Pokemon not found in map')
			return {
				name: pokemon.name,
				pokedexId: pokemon.pokedexId,
				types: pokemon.types,
				multipliers: pokemon.multipliers || undefined,
				weaknesses: pokemon.weaknesses || undefined,
			}
		}),
	}
}

const resolveTeams = async ({
	command,
	services: { pokemonService },
}: {
	command: CreateBattleSimulationCommand
	services: Services
}) => {
	const uniquePokemonIds = extractUniquePokemonIds(command)
	const pokemons = await pokemonService
		.getByIds(uniquePokemonIds)
		.catch(rethrow('Unexpected error calling pokemonService.getByIds'))

	const homeTeam = resolveTeam({
		team: command.homeTeam,
		pokemons,
		trainerName: command.homeTeam.trainerId,
	})

	const awayTeam = resolveTeam({
		team: command.awayTeam,
		pokemons,
		trainerName: command.awayTeam.trainerId,
	})

	return { awayTeam, homeTeam }
}

interface RunSimulationCommand {
	battleSimulation: ReturnType<typeof battle>
	maxNumberOfTurns?: number
	teams: { homeTeam: Team; awayTeam: Team }
}

const runSimulation = async ({
	teams: { awayTeam, homeTeam },
	battleSimulation,
	maxNumberOfTurns = 10,
}: RunSimulationCommand) => {
	battleSimulation.addHomeTeam(homeTeam)
	battleSimulation.addAwayTeam(awayTeam)
	battleSimulation.begin()

	const homeTeamActions = battleSimulation.selectTeam(homeTeam.trainer.name)
	const awayTeamActions = battleSimulation.selectTeam(awayTeam.trainer.name)

	let turn = 0
	while (!battleSimulation.ended && turn < maxNumberOfTurns) {
		turn += 1
		if (!battleSimulation.ended) {
			homeTeamActions.attack()
		}
		if (!battleSimulation.ended) {
			awayTeamActions.attack()
		}
	}
}
export interface CreateBattleSimulationCommand {
	homeTeam: TeamDto
	awayTeam: TeamDto
}

export interface TeamDto {
	trainerId: string
	pokemons: number[]
}

interface BattleLogRecord {
	title: string
	details: string[]
	turn: number
}

// TODO: extract
export interface Services {
	pokemonService: PokemonService
}

export interface PokemonService {
	getByIds: (id: number[]) => Promise<Pokemon[]>
}

export interface Pokemon {
	pokedexId: number
	types: string[]
	name: string
	img: string
	height: string
	weight: string
	multipliers: number[]
	weaknesses: string[]
}
