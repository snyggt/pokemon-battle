import { inMemoryPokemonService } from 'inMemoryPokemonService'
import { createBattleSimulationHandler } from '@snyggt/pokemon-battle-app/src/createBattleSimulation'
describe('given a inMemoryPokemonService', () => {
	describe('when calling getByIds with a few numbers', () => {
		it('then it should return expecte result', async () => {
			const result = await inMemoryPokemonService.getByIds([1, 2, 55, 77])

			const expected = [
				{
					height: '0.71 m',
					img: 'http://www.serebii.net/pokemongo/pokemon/001.png',
					multipliers: [1.58],
					name: 'Bulbasaur',
					pokedexId: 1,
					types: ['Grass', 'Poison'],
					weaknesses: ['Fire', 'Ice', 'Flying', 'Psychic'],
					weight: '6.9 kg',
				},
				{
					height: '0.99 m',
					img: 'http://www.serebii.net/pokemongo/pokemon/002.png',
					multipliers: [1.2, 1.6],
					name: 'Ivysaur',
					pokedexId: 2,
					types: ['Grass', 'Poison'],
					weaknesses: ['Fire', 'Ice', 'Flying', 'Psychic'],
					weight: '13.0 kg',
				},
				{
					height: '1.70 m',
					img: 'http://www.serebii.net/pokemongo/pokemon/055.png',
					multipliers: [],
					name: 'Golduck',
					pokedexId: 55,
					types: ['Water'],
					weaknesses: ['Electric', 'Grass'],
					weight: '76.6 kg',
				},
				{
					height: '0.99 m',
					img: 'http://www.serebii.net/pokemongo/pokemon/077.png',
					multipliers: [1.48, 1.5],
					name: 'Ponyta',
					pokedexId: 77,
					types: ['Fire'],
					weaknesses: ['Water', 'Ground', 'Rock'],
					weight: '30.0 kg',
				},
			]

			expect(result).toEqual(expected)
		})
	})

	describe('when every pokemon is passed to createBattleSimulation', () => {
		test('then no unexpected errors should happen', async () => {
			const handler = createBattleSimulationHandler({
				pokemonService: inMemoryPokemonService,
			})

			const faulty = await Promise.all(
				Array(150)
					.fill('')
					.map((_, index) => ({
						pokedexId: index + 1,
					}))
					.map(pokemon =>
						handler({
							awayTeam: {
								pokemons: [pokemon, pokemon, pokemon],
								trainerId: 'Erik',
							},
							homeTeam: {
								pokemons: [pokemon, pokemon, pokemon],
								trainerId: 'Johan',
							},
						})
							.then(_ => undefined)
							.catch(e => ({ error: e.message, pokemon }))
					)
			)
			expect(faulty.filter(Boolean)).toEqual([])
		})
	})
})
