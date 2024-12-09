import { battle, Team, Pokemon } from './battle'

export const validPokemon: (overrides?: Partial<Pokemon>) => Pokemon = ({
	pokedexId = 1,
	name = 'Testimon',
	multipliers = [],
	types = ['Fire'],
	weaknesses = [],
} = {}) => ({
	name,
	multipliers,
	pokedexId,
	types,
	weaknesses,
})

export const validTeam: () => Team = () => ({
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

			testBattle.addHomeTeam(validTeam())

			expect(testBattle.hasError).toBe(false)
		})
	})

	const arr = (num: number) => Array(num).fill('')

	describe('when adding a invalid home team', () => {
		test.each`
			invalidTeam                                                       | expectedError
			${''}                                                             | ${'Team must be a object'}
			${' '}                                                            | ${'Team must be a object'}
			${'      '}                                                       | ${'Team must be a object'}
			${undefined}                                                      | ${'Team must be a object'}
			${null}                                                           | ${'Team must be a object'}
			${true}                                                           | ${'Team must be a object'}
			${false}                                                          | ${'Team must be a object'}
			${1}                                                              | ${'Team must be a object'}
			${0}                                                              | ${'Team must be a object'}
			${Symbol()}                                                       | ${'Team must be a object'}
			${new Error('')}                                                  | ${'Team must be a object'}
			${{}}                                                             | ${'Trainer must be a object'}
			${{ ...validTeam(), trainer: null }}                              | ${'Trainer must be a object'}
			${{ ...validTeam(), trainer: undefined }}                         | ${'Trainer must be a object'}
			${{ ...validTeam(), trainer: 'invalid' }}                         | ${'Trainer must be a object'}
			${{ ...validTeam(), trainer: '' }}                                | ${'Trainer must be a object'}
			${{ ...validTeam(), trainer: { name: '' } }}                      | ${'Trainer name must be a non empty string'}
			${{ ...validTeam(), trainer: { name: ' ' } }}                     | ${'Trainer name must be a non empty string'}
			${{ ...validTeam(), trainer: { name: null } }}                    | ${'Trainer name must be a non empty string'}
			${{ ...validTeam(), trainer: { name: undefined } }}               | ${'Trainer name must be a non empty string'}
			${{ ...validTeam(), trainer: { name: 1 } }}                       | ${'Trainer name must be a non empty string'}
			${{ ...validTeam(), pokemons: null }}                             | ${'Team pokemons must be an array'}
			${{ ...validTeam(), pokemons: undefined }}                        | ${'Team pokemons must be an array'}
			${{ ...validTeam(), pokemons: '' }}                               | ${'Team pokemons must be an array'}
			${{ ...validTeam(), pokemons: true }}                             | ${'Team pokemons must be an array'}
			${{ ...validTeam(), pokemons: [] }}                               | ${'Each team must have three pokemons'}
			${{ ...validTeam(), pokemons: arr(1).map(() => validPokemon()) }} | ${'Each team must have three pokemons'}
			${{ ...validTeam(), pokemons: arr(2).map(() => validPokemon()) }} | ${'Each team must have three pokemons'}
			${{ ...validTeam(), pokemons: arr(4).map(() => validPokemon()) }} | ${'Each team must have three pokemons'}
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
