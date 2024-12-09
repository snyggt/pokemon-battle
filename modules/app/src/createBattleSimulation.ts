export interface CreateBattleSimulationCommand {
	homeTeam: Team
	awayTeam: Team
}

export interface CreateBattleSimulationResult {
	battleLog: Team
	awayTeam: Team
}

export const createBattleSimulation = (
	_command: CreateBattleSimulationCommand
) => {
	return { battleLog: [{ event: 'battle started' }] }
}

interface Team {
	trainerId: string
	pokemons: { pokedexId: number }[]
}
