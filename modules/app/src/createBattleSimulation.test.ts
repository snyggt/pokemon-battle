import {
	createBattleSimulation,
	CreateBattleSimulationCommand,
} from 'createBattleSimulation'

describe('given a valid CreateBattleSimulation command', () => {
	const validCommand: CreateBattleSimulationCommand = {
		homeTeam: {
			trainerId: 'homeTrainer',
			pokemons: [{ pokedexId: 1 }, { pokedexId: 1 }, { pokedexId: 1 }],
		},
		awayTeam: {
			trainerId: 'awayTrainer',
			pokemons: [{ pokedexId: 1 }, { pokedexId: 1 }, { pokedexId: 1 }],
		},
	}
	describe('when simulation runns to success', () => {
		it('then a battle log should be returned', () => {
			const result = createBattleSimulation(validCommand)
			expect(result.battleLog).toBeDefined()
		})
	})
})
