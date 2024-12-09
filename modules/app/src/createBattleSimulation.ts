export interface CreateBattleSimulationCommand {
	homeTeam: Team
	awayTeam: Team
}

export interface CreateBattleSimulationResult {
	battleLog: BattleLogRecord[]
	winningTeam: Team
	losingTeam: Team
}

export const createBattleSimulation = async (
	_command: CreateBattleSimulationCommand
): Promise<CreateBattleSimulationResult> => {
	return {
		battleLog: [{ event: 'battle started' }],
		winningTeam: _command.awayTeam,
		losingTeam: _command.homeTeam,
	}
}

interface Team {
	trainerId: string
	pokemons: { pokedexId: number }[]
}

interface BattleLogRecord {
	event: string
}
