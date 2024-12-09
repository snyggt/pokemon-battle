import { battle, Team, Pokemon } from './battle'

export const validPokemon: (overrides?: Partial<Pokemon>) => Pokemon = ({
	pokedexId = 2,
	name = 'Testimon',
	multipliers = [1.1],
	types = ['Fire'],
	weaknesses = [],
} = {}) => ({
	name,
	multipliers,
	pokedexId,
	types,
	weaknesses,
})

export const team: () => Team = () => ({
	trainer: { name: 'testTrainer' },
	pokemons: [validPokemon(), validPokemon(), validPokemon()],
})

describe('given a new battle', () => {
	test('then game should not be completed', async () => {
		const testBattle = battle()

		expect(testBattle.gameCompleted).toBe(false)
	})

	test('then no errors should exist', async () => {
		const testBattle = battle()

		expect(testBattle.hasError).toBe(false)
	})

	describe('when adding a valid homeTeam', () => {
		test('no errors should exist', async () => {
			const testBattle = battle()

			testBattle.addHomeTeam(team())

			expect(testBattle.hasError).toBe(false)
		})
	})

	const arr = (num: number) => new Array(num).fill('')
	const twoValidPokemon = arr(2).map(validPokemon)

	describe('when adding a invalid home team', () => {
		test.each`
			invalidTeam                                                                                            | expectedError
			${''}                                                                                                  | ${'Team must be a object'}
			${' '}                                                                                                 | ${'Team must be a object'}
			${undefined}                                                                                           | ${'Team must be a object'}
			${null}                                                                                                | ${'Team must be a object'}
			${true}                                                                                                | ${'Team must be a object'}
			${false}                                                                                               | ${'Team must be a object'}
			${1}                                                                                                   | ${'Team must be a object'}
			${0}                                                                                                   | ${'Team must be a object'}
			${Symbol()}                                                                                            | ${'Team must be a object'}
			${new Error('')}                                                                                       | ${'Team must be a object'}
			${{}}                                                                                                  | ${'Trainer must be a object'}
			${{ ...team(), trainer: null }}                                                                        | ${'Trainer must be a object'}
			${{ ...team(), trainer: undefined }}                                                                   | ${'Trainer must be a object'}
			${{ ...team(), trainer: 'invalid' }}                                                                   | ${'Trainer must be a object'}
			${{ ...team(), trainer: '' }}                                                                          | ${'Trainer must be a object'}
			${{ ...team(), trainer: { name: '' } }}                                                                | ${'Trainer name must be a non empty string'}
			${{ ...team(), trainer: { name: ' ' } }}                                                               | ${'Trainer name must be a non empty string'}
			${{ ...team(), trainer: { name: null } }}                                                              | ${'Trainer name must be a non empty string'}
			${{ ...team(), trainer: { name: undefined } }}                                                         | ${'Trainer name must be a non empty string'}
			${{ ...team(), trainer: { name: 1 } }}                                                                 | ${'Trainer name must be a non empty string'}
			${{ ...team(), pokemons: null }}                                                                       | ${'Team pokemons must be an array'}
			${{ ...team(), pokemons: undefined }}                                                                  | ${'Team pokemons must be an array'}
			${{ ...team(), pokemons: '' }}                                                                         | ${'Team pokemons must be an array'}
			${{ ...team(), pokemons: true }}                                                                       | ${'Team pokemons must be an array'}
			${{ ...team(), pokemons: [] }}                                                                         | ${'Each team must have three pokemons'}
			${{ ...team(), pokemons: arr(1).map(validPokemon) }}                                                   | ${'Each team must have three pokemons'}
			${{ ...team(), pokemons: arr(2).map(validPokemon) }}                                                   | ${'Each team must have three pokemons'}
			${{ ...team(), pokemons: arr(4).map(validPokemon) }}                                                   | ${'Each team must have three pokemons'}
			${{ ...team(), pokemons: [null, null, null] }}                                                         | ${'Each team pokemon must be a object'}
			${{ ...team(), pokemons: [validPokemon(), false, validPokemon()] }}                                    | ${'Each team pokemon must be a object'}
			${{ ...team(), pokemons: [...twoValidPokemon, null] }}                                                 | ${'Each team pokemon must be a object'}
			${{ ...team(), pokemons: [...twoValidPokemon, {}] }}                                                   | ${'Each team pokemon pokedexId must be a number from 1 to 151'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), pokedexId: 0 }] }}                  | ${'Each team pokemon pokedexId must be a number from 1 to 151'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), pokedexId: 152 }] }}                | ${'Each team pokemon pokedexId must be a number from 1 to 151'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), pokedexId: null }] }}               | ${'Each team pokemon pokedexId must be a number from 1 to 151'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), types: null }] }}                   | ${'Pokemon types field must be an array'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), types: 'invalid' }] }}              | ${'Pokemon types field must be an array'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), types: [] }] }}                     | ${'Pokemon types field must have at least one type'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), types: ['invalid'] }] }}            | ${'Pokemon types field must only include the following types: Grass, Poison, Fire, Flying, Water, Bug, Normal, Electric, Ground, Fighting, Psychic, Rock, Ice, Ghost, Dragon'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), types: ['Fire', 'Coder'] }] }}      | ${'Pokemon types field must only include the following types: Grass, Poison, Fire, Flying, Water, Bug, Normal, Electric, Ground, Fighting, Psychic, Rock, Ice, Ghost, Dragon'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), weaknesses: null }] }}              | ${'Optional Pokemon field weaknesses must be an array if defined'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), weaknesses: 'invalid' }] }}         | ${'Optional Pokemon field weaknesses must be an array if defined'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), weaknesses: ['invalid'] }] }}       | ${'Pokemon weaknesses if defined must only include any of the following types: Grass, Poison, Fire, Flying, Water, Bug, Normal, Electric, Ground, Fighting, Psychic, Rock, Ice, Ghost, Dragon'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), weaknesses: ['Fire', 'Coder'] }] }} | ${'Pokemon weaknesses if defined must only include any of the following types: Grass, Poison, Fire, Flying, Water, Bug, Normal, Electric, Ground, Fighting, Psychic, Rock, Ice, Ghost, Dragon'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), multipliers: null }] }}             | ${'Optional Pokemon field multipliers field must be an array if defined'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), multipliers: 'invalid' }] }}        | ${'Optional Pokemon field multipliers field must be an array if defined'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), multipliers: [0] }] }}              | ${'If Pokemon multipliers is defined it must only include numbers between 0.001 and 5.000'}
			${{ ...team(), pokemons: [...twoValidPokemon, { ...validPokemon(), multipliers: [1.3, 0] }] }}         | ${'If Pokemon multipliers is defined it must only include numbers between 0.001 and 5.000'}
		`(
			'then "$invalidTeam" should cause error with message $expectedError',
			async ({ invalidTeam, expectedError }) => {
				const testBattle = battle()

				testBattle.addHomeTeam(invalidTeam)

				expect(testBattle.hasError).toBe(true)
				expect(testBattle.errors).toContainEqual({
					message: expectedError,
					type: 'validation',
				})
			}
		)
	})
})
