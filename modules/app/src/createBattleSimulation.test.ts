import { assert } from '@snyggt/pokemon-battle-domain/src/assert'
import {
	createBattleSimulationHandler,
	CreateBattleSimulationCommand,
} from 'createBattleSimulation'

beforeEach(() => {
	pokemonService.getByIds.mockResolvedValue(mockedPokemons)
})

describe('given a valid CreateBattleSimulation command', () => {
	describe('when simulation runs to success', () => {
		test('then simulation result includes a battleLog', async () => {
			const result = await createBattleSimulation(validCommand)

			assert(result.status === 'success', 'Status is not success')
			expect(result.battleLog).toBeDefined()
		})

		test('then simulation result includes a status', async () => {
			const result = await createBattleSimulation(validCommand)

			expect(result.status).toBeDefined()
		})

		test('then simulation status is success', async () => {
			const result = await createBattleSimulation(validCommand)

			expect(result).toEqual({
				battleLog: expect.arrayContaining([
					{
						details: [
							'Pokémon info:',
							'Bulbasaur (#1); types: Grass, Poison; weaknesses: Fire, Ice, Flying, Psychic',
							'Bulbasaur (#1); types: Grass, Poison; weaknesses: Fire, Ice, Flying, Psychic',
							'Bulbasaur (#1); types: Grass, Poison; weaknesses: Fire, Ice, Flying, Psychic',
						],
						title:
							'Trainer homeTrainer with pokémons Bulbasaur, Bulbasaur, Bulbasaur joined homeTeam',
						turn: 0,
					},
					{
						details: [
							'Pokémon info:',
							'Bulbasaur (#1); types: Grass, Poison; weaknesses: Fire, Ice, Flying, Psychic',
							'Bulbasaur (#1); types: Grass, Poison; weaknesses: Fire, Ice, Flying, Psychic',
							'Bulbasaur (#1); types: Grass, Poison; weaknesses: Fire, Ice, Flying, Psychic',
						],
						title:
							'Trainer awayTrainer with pokémons Bulbasaur, Bulbasaur, Bulbasaur joined awayTeam',
						turn: 0,
					},
					{
						details: [
							"Turn 1 begins with trainer 'homeTrainer' with choosen pokémon 'Bulbasaur' VS. trainer 'awayTrainer' with choosen pokémon 'Bulbasaur'",
						],
						title: expect.any(String),
						turn: 1,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 868 health left'",
						turn: 2,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 868 health left'",
						turn: 3,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 736 health left'",
						turn: 4,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 736 health left'",
						turn: 5,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 604 health left'",
						turn: 6,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 604 health left'",
						turn: 7,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 472 health left'",
						turn: 8,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 472 health left'",
						turn: 9,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 340 health left'",
						turn: 10,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 340 health left'",
						turn: 11,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 208 health left'",
						turn: 12,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 208 health left'",
						turn: 13,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 76 health left'",
						turn: 14,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 76 health left'",
						turn: 15,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 76 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 0 health left'",
						turn: 16,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 76 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 0 health left'",
						turn: 17,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 868 health left'",
						turn: 18,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 868 health left'",
						turn: 19,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 736 health left'",
						turn: 20,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 736 health left'",
						turn: 21,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 604 health left'",
						turn: 22,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 604 health left'",
						turn: 23,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 472 health left'",
						turn: 24,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 472 health left'",
						turn: 25,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 340 health left'",
						turn: 26,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 340 health left'",
						turn: 27,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 208 health left'",
						turn: 28,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 208 health left'",
						turn: 29,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 76 health left'",
						turn: 30,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 76 health left'",
						turn: 31,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 76 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 0 health left'",
						turn: 32,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 76 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 0 health left'",
						turn: 33,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 868 health left'",
						turn: 34,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 868 health left'",
						turn: 35,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 736 health left'",
						turn: 36,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 736 health left'",
						turn: 37,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 604 health left'",
						turn: 38,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 604 health left'",
						turn: 39,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 472 health left'",
						turn: 40,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 472 health left'",
						turn: 41,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 340 health left'",
						turn: 42,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 340 health left'",
						turn: 43,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 208 health left'",
						turn: 44,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 208 health left'",
						turn: 45,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 76 health left'",
						turn: 46,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'awayTrainer' with pokémon 'Bulbasaur' deals 132 damage to trainer 'homeTrainers' pokémon 'Bulbasaur' resulting in 76 health left'",
						turn: 47,
					},
					{
						details: [
							"Defending Pokémon 'Bulbasaur' has no weaknesses against Pokémon 'Bulbasaur'",
						],
						title:
							"Trainer 'homeTrainer' with pokémon 'Bulbasaur' deals 76 damage to trainer 'awayTrainers' pokémon 'Bulbasaur' resulting in 0 health left'",
						turn: 48,
					},
					{
						details: ['The battle lasted 48 turns'],
						title: expect.stringContaining(
							"ended with winner homeTrainer! Pokémons 'Bulbasaur' still standing strong!"
						),
						turn: 48,
					},
				]),
				status: 'success',
			})
		})
	})

	describe('when simulation result in error', () => {
		test('then simulation throws error message with more context', async () => {
			const shouldThrow = async () =>
				await createBattleSimulation({
					...validCommand,
					awayTeam: {
						...validCommand.awayTeam,
						trainerName: 2 as unknown as string,
					},
				})

			await expect(shouldThrow).rejects.toThrow(
				'Unexpected error calling runSimulation => Trainer name must be a non empty string'
			)
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
		trainerName: 'homeTrainer',
		pokemons: [1, 1, 1],
	},
	awayTeam: {
		trainerName: 'awayTrainer',
		pokemons: [1, 1, 1],
	},
}

const pokemonService = { getByIds: jest.fn(), getAll: jest.fn() }

const createBattleSimulation = createBattleSimulationHandler({
	pokemonService,
})

const mockedPokemons = [
	{
		pokedexId: 1,
		num: '001',
		name: 'Bulbasaur',
		img: 'http://www.serebii.net/pokemongo/pokemon/001.png',
		types: ['Grass', 'Poison'],
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
]
