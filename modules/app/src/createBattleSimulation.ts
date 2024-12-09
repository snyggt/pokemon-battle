import { rethrow } from './errorHandling/rethrow'
import { battle } from '@snyggt/pokemon-battle-domain/src/battle'

export interface CreateBattleSimulationCommand {
	homeTeam: Team
	awayTeam: Team
}

export interface CreateBattleSimulationResult {
	status: 'success'
	message: string
	battleLog: BattleLogRecord[]
	winningTeam: Team
	losingTeam: Team
}

export const createBattleSimulationHandler = ({ pokemonService }: Services) =>
	async function createBattleSimulationHandler(
		command: CreateBattleSimulationCommand
	): Promise<CreateBattleSimulationResult> {
		const uniquePokemonIds = extractUniquePokemonIds(command)
		await pokemonService
			.getByIds(uniquePokemonIds)
			.catch(rethrow('Unexpected error calling pokemonService.getByIds'))

		const battleSimulation = battle()

		runSimulation({
			shouldContinue: () => battleSimulation.gameCompleted,
			onSimulationTick: () => {
				// do simulation here
			},
		})
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

const runSimulation = ({
	shouldContinue,
	onSimulationTick,
	maxNumberOfTurns = 10,
}: {
	onSimulationTick: () => void
	shouldContinue: () => boolean
	maxNumberOfTurns?: number
}) => {
	let turn = 0
	while (shouldContinue() && turn < maxNumberOfTurns) {
		turn += 1
		onSimulationTick()
	}
}
interface Team {
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
	getByIds: (id: number[]) => Promise<Pokemon>
}

interface Pokemon {
	pokedexId: string
}
