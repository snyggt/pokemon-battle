import assert from 'assert'
import { rethrow } from './errorHandling/rethrow'
import { battle, Team } from '@snyggt/pokemon-battle-domain/src/battle'

export interface CreateBattleSimulationCommand {
	homeTeam: TeamDto
	awayTeam: TeamDto
}

export interface CreateBattleSimulationResult {
	status: 'success'
	message: string
	battleLog: BattleLogRecord[]
	winningTeam: TeamDto
	losingTeam: TeamDto
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
			maxNumberOfTurns: 20,
		}).catch(rethrow('Unexpected error calling runSimulation'))

		return {
			battleLog: [{ event: 'battle started' }],
			winningTeam: command.awayTeam,
			losingTeam: command.homeTeam,
			message: 'ran to success',
			status: 'success',
		}
	}

const extractUniquePokemonIds = ({
	awayTeam,
	homeTeam,
}: CreateBattleSimulationCommand) => {
	const allPokemonIds = [...awayTeam.pokemons, ...homeTeam.pokemons].flatMap(
		pokemon => pokemon.pokedexId
	)
	const uniquePokemonIds = new Set(allPokemonIds)
	return [...uniquePokemonIds]
}

const resolveTeam = ({
	command,
	pokemons,
	trainerName,
}: {
	trainerName: string
	command: CreateBattleSimulationCommand
	pokemons: Pokemon[]
}) => {
	return {
		trainer: { name: trainerName },
		pokemons: command.homeTeam.pokemons.map(pokemonDto => {
			const pokemon = pokemons.find(
				pokmeon => pokmeon.pokedexId === pokemonDto.pokedexId
			)

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
		command,
		pokemons,
		trainerName: 'HomeTeamTrainer',
	})

	const awayTeam = resolveTeam({
		command,
		pokemons,
		trainerName: 'AwayTeamTrainer',
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

	let turn = 0
	while (!battleSimulation.ended && turn < maxNumberOfTurns) {
		turn += 1
		const homeTeamActions = battleSimulation.selectTeam(homeTeam.trainer.name)
		const awayTeamActions = battleSimulation.selectTeam(awayTeam.trainer.name)
		homeTeamActions.attack()
		awayTeamActions.attack()
	}
}
interface TeamDto {
	trainerId: string
	pokemons: { pokedexId: number }[]
}

interface BattleLogRecord {
	event: string
}

// TODO: extract
export interface Services {
	pokemonService: PokemonService
}

interface PokemonService {
	getByIds: (id: number[]) => Promise<Pokemon[]>
}

interface Pokemon {
	pokedexId: number
	num: string
	name: string
	img: string
	types: string[]
	height: string
	weight: string
	candy: string
	egg: string
	spawn_chance: number
	avg_spawns: number
	spawn_time: string
	multipliers?: number[]
	weaknesses?: number[]
}
