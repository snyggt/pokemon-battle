import { assert } from '@snyggt/pokemon-battle-domain/src/assert'
import { createQueryPokemonsHandler } from 'queryPokemonsHandler'

beforeEach(() => {
	pokemonService.getAll.mockResolvedValue(mockedPokemons)
})

describe('given a valid CreateBattleSimulation command', () => {
	describe('when simulation runs to success without query params', () => {
		test('then all pokemons should be returned', async () => {
			const result = await queryPokemons()

			assert(result.status === 'success', 'Status is not success')
			expect(result.pokemons.length).toBe(mockedPokemons.length)
		})
	})
})

const pokemonService = { getByIds: jest.fn(), getAll: jest.fn() }

const queryPokemons = createQueryPokemonsHandler({
	pokemonService,
})

const mockedPokemons = [
	{
		pokedexId: 1,
		types: ['Grass', 'Poison'],
		multipliers: [1.58],
		weaknesses: ['Fire', 'Ice', 'Flying', 'Psychic'],
		height: '0.71 m',
		img: 'http://www.serebii.net/pokemongo/pokemon/001.png',
		name: 'Bulbasaur',
		weight: '6.9 kg',
	},
	{
		pokedexId: 2,
		types: ['Grass', 'Poison'],
		multipliers: [1.2, 1.6],
		weaknesses: ['Fire', 'Ice', 'Flying', 'Psychic'],
		height: '0.99 m',
		img: 'http://www.serebii.net/pokemongo/pokemon/002.png',
		name: 'Ivysaur',
		weight: '13.0 kg',
	},
	{
		pokedexId: 3,
		types: ['Grass', 'Poison'],
		multipliers: [],
		weaknesses: ['Fire', 'Ice', 'Flying', 'Psychic'],
		height: '2.01 m',
		img: 'http://www.serebii.net/pokemongo/pokemon/003.png',
		name: 'Venusaur',
		weight: '100.0 kg',
	},
	{
		pokedexId: 4,
		types: ['Fire'],
		multipliers: [1.65],
		weaknesses: ['Water', 'Ground', 'Rock'],
		height: '0.61 m',
		img: 'http://www.serebii.net/pokemongo/pokemon/004.png',
		name: 'Charmander',
		weight: '8.5 kg',
	},
	{
		pokedexId: 5,
		types: ['Fire'],
		multipliers: [1.79],
		weaknesses: ['Water', 'Ground', 'Rock'],
		height: '1.09 m',
		img: 'http://www.serebii.net/pokemongo/pokemon/005.png',
		name: 'Charmeleon',
		weight: '19.0 kg',
	},
	{
		pokedexId: 6,
		types: ['Fire', 'Flying'],
		multipliers: [],
		weaknesses: ['Water', 'Electric', 'Rock'],
		height: '1.70 m',
		img: 'http://www.serebii.net/pokemongo/pokemon/006.png',
		name: 'Charizard',
		weight: '90.5 kg',
	},
	{
		pokedexId: 7,
		types: ['Water'],
		multipliers: [2.1],
		weaknesses: ['Electric', 'Grass'],
		height: '0.51 m',
		img: 'http://www.serebii.net/pokemongo/pokemon/007.png',
		name: 'Squirtle',
		weight: '9.0 kg',
	},
]
