import {
	createBattleSimulationHandler,
	CreateBattleSimulationCommand,
} from 'createBattleSimulation'

beforeEach(() => {
	pokemonService.getByIds.mockResolvedValue([
		{
			id: 1,
			num: '001',
			name: 'Bulbasaur',
			img: 'http://www.serebii.net/pokemongo/pokemon/001.png',
			type: ['Grass', 'Poison'],
			height: '0.71 m',
			weight: '6.9 kg',
			candy: 'Bulbasaur Candy',
			candy_count: 25,
			egg: '2 km',
			spawn_chance: 0.69,
			avg_spawns: 69,
			spawn_time: '20:00',
			multipliers: [1.58],
			weaknesses: ['Fire', 'Ice', 'Flying', 'Psychic'],
			next_evolution: [
				{
					num: '002',
					name: 'Ivysaur',
				},
				{
					num: '003',
					name: 'Venusaur',
				},
			],
		},
	])
})

describe('given a valid CreateBattleSimulation command', () => {
	describe('when simulation runs to success', () => {
		test('then simulation result includes a battleLog', async () => {
			const result = await createBattleSimulation(validCommand)

			expect(result.battleLog).toBeDefined()
		})

		test('then simulation result includes a winning team', async () => {
			const result = await createBattleSimulation(validCommand)

			expect(result.winningTeam).toBeDefined()
		})

		test('then simulation result includes a losing team', async () => {
			const result = await createBattleSimulation(validCommand)

			expect(result.losingTeam).toBeDefined()
		})

		test('then simulation result includes a status', async () => {
			const result = await createBattleSimulation(validCommand)

			expect(result.status).toBeDefined()
		})

		test('then simulation status is success', async () => {
			const result = await createBattleSimulation(validCommand)

			expect(result.status).toBe('success')
		})
	})

	describe('when pokemonService throws an exception', () => {
		test('then simulation throws error message with more context', async () => {
			const errorFromPokemonService = new Error('Error connecting to database')
			pokemonService.getByIds.mockRejectedValue(errorFromPokemonService)
			const expectedError = new Error(
				'Unexpected error calling resolveTeams => Unexpected error calling pokemonService.getByIds => Error connecting to database'
			)

			const shouldThrow = async () => createBattleSimulation(validCommand)

			await expect(shouldThrow).rejects.toThrow(expectedError)
		})
	})
})

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

const pokemonService = { getByIds: jest.fn() }

const createBattleSimulation = createBattleSimulationHandler({
	pokemonService,
})
