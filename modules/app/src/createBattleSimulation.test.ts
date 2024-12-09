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
		test('then simulation result includes a battleLog', async () => {
			const result = await createBattleSimulation(validCommand)

			expect(result.battleLog).toBeDefined()
		})

		test('then simulation result includes a winning team', async () => {
			const result = await createBattleSimulation(validCommand)

			expect(result.winningTeam).toBeDefined()
		})
	})
})
