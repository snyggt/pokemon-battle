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
	test('then game should not be ended', async () => {
		const testBattle = battle()

		expect(testBattle.ended).toBe(false)
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

	describe('when adding a valid home team if home team already exists', () => {
		test('then a forbidden error should exist', async () => {
			const testBattle = battle()

			testBattle.addHomeTeam(team())
			testBattle.addHomeTeam(team())

			expect(testBattle.errors).toEqual([
				{
					message: 'addHomeTeam: team already exists',
					type: 'forbidden',
				},
			])
			expect(testBattle.hasError).toBe(true)
		})
	})

	describe('when adding a valid away team if away team already exists', () => {
		test('then a forbidden error should exist', async () => {
			const testBattle = battle()

			testBattle.addAwayTeam(team())
			testBattle.addAwayTeam(team())

			expect(testBattle.errors).toEqual([
				{
					message: 'addAwayTeam: team already exists',
					type: 'forbidden',
				},
			])
			expect(testBattle.hasError).toBe(true)
		})
	})

	const createArray = (num: number) => new Array(num).fill('')

	describe('when adding a invalid home and away team', () => {
		test.each`
			invalid          | expectedError
			${''}            | ${'Team must be a object'}
			${' '}           | ${'Team must be a object'}
			${undefined}     | ${'Team must be a object'}
			${null}          | ${'Team must be a object'}
			${true}          | ${'Team must be a object'}
			${false}         | ${'Team must be a object'}
			${1}             | ${'Team must be a object'}
			${0}             | ${'Team must be a object'}
			${Symbol()}      | ${'Team must be a object'}
			${new Error('')} | ${'Team must be a object'}
			${{}}            | ${'Trainer must be a object'}
		`(
			'then a invalid team object "$invalid" should cause error with message "$expectedError"',
			async ({ invalid, expectedError }) => {
				const testBattle = battle()

				testBattle.addHomeTeam(invalid)
				testBattle.addAwayTeam(invalid)

				expect(testBattle.hasError).toBe(true)
				expect(testBattle.errors).toEqual([
					{
						message: 'homeTeam: ' + expectedError,
						type: 'validation',
					},
					{
						message: 'awayTeam: ' + expectedError,
						type: 'validation',
					},
				])
			}
		)

		test.each`
			invalid                | expectedError
			${null}                | ${'Trainer must be a object'}
			${undefined}           | ${'Trainer must be a object'}
			${'invalid'}           | ${'Trainer must be a object'}
			${''}                  | ${'Trainer must be a object'}
			${{ name: '' }}        | ${'Trainer name must be a non empty string'}
			${{ name: ' ' }}       | ${'Trainer name must be a non empty string'}
			${{ name: null }}      | ${'Trainer name must be a non empty string'}
			${{ name: undefined }} | ${'Trainer name must be a non empty string'}
			${{ name: 1 }}         | ${'Trainer name must be a non empty string'}
		`(
			'then a invalid trainer field "$invalid" should cause error with message "$expectedError"',
			async ({ invalid, expectedError }) => {
				const testBattle = battle()
				const invalidTeam = { ...team(), trainer: invalid }

				testBattle.addHomeTeam(invalidTeam)
				testBattle.addAwayTeam(invalidTeam)

				expect(testBattle.hasError).toBe(true)
				expect(testBattle.errors).toEqual([
					{
						message: 'homeTeam: ' + expectedError,
						type: 'validation',
					},
					{
						message: 'awayTeam: ' + expectedError,
						type: 'validation',
					},
				])
			}
		)

		test.each`
			invalid                                    | expectedError
			${null}                                    | ${'Team pokemons must be an array'}
			${undefined}                               | ${'Team pokemons must be an array'}
			${''}                                      | ${'Team pokemons must be an array'}
			${true}                                    | ${'Team pokemons must be an array'}
			${[]}                                      | ${'Each team must have three pokemons'}
			${createArray(1).map(validPokemon)}        | ${'Each team must have three pokemons'}
			${createArray(2).map(validPokemon)}        | ${'Each team must have three pokemons'}
			${createArray(4).map(validPokemon)}        | ${'Each team must have three pokemons'}
			${[null, null, null]}                      | ${'Each team pokemon must be a object'}
			${[validPokemon(), false, validPokemon()]} | ${'Each team pokemon must be a object'}
			${[validPokemon(), validPokemon(), null]}  | ${'Each team pokemon must be a object'}
			${[validPokemon(), validPokemon(), {}]}    | ${'Each team pokemon pokedexId must be a number from 1 to 151'}
		`(
			'then a invalid pokemons field "$invalid" should cause error with message "$expectedError"',
			async ({ invalid, expectedError }) => {
				const testBattle = battle()
				const invalidTeam = { ...team(), pokemons: invalid }

				testBattle.addHomeTeam(invalidTeam)
				testBattle.addAwayTeam(invalidTeam)

				expect(testBattle.hasError).toBe(true)
				expect(testBattle.errors).toEqual([
					{
						message: 'homeTeam: ' + expectedError,
						type: 'validation',
					},
					{
						message: 'awayTeam: ' + expectedError,
						type: 'validation',
					},
				])
			}
		)

		test.each`
			invalid | expectedError
			${0}    | ${'Each team pokemon pokedexId must be a number from 1 to 151'}
			${152}  | ${'Each team pokemon pokedexId must be a number from 1 to 151'}
			${null} | ${'Each team pokemon pokedexId must be a number from 1 to 151'}
		`(
			'then a invalid pokemons field pokedexId "$invalid" should cause error with message "$expectedError"',
			async ({ invalid, expectedError }) => {
				const testBattle = battle()
				const invalidTeam = {
					...team(),
					pokemons: [
						validPokemon(),
						validPokemon(),
						{ ...validPokemon(), pokedexId: invalid },
					],
				}

				testBattle.addHomeTeam(invalidTeam)
				testBattle.addAwayTeam(invalidTeam)

				expect(testBattle.hasError).toBe(true)
				expect(testBattle.errors).toEqual([
					{
						message: 'homeTeam: ' + expectedError,
						type: 'validation',
					},
					{
						message: 'awayTeam: ' + expectedError,
						type: 'validation',
					},
				])
			}
		)

		test.each`
			invalid              | expectedError
			${null}              | ${'Pokemon types field must be an array'}
			${'invalid'}         | ${'Pokemon types field must be an array'}
			${[]}                | ${'Pokemon types field must have at least one type'}
			${['invalid']}       | ${'Pokemon types field must only include the following types: Grass, Poison, Fire, Flying, Water, Bug, Normal, Electric, Ground, Fighting, Psychic, Rock, Ice, Ghost, Dragon'}
			${['Fire', 'Coder']} | ${'Pokemon types field must only include the following types: Grass, Poison, Fire, Flying, Water, Bug, Normal, Electric, Ground, Fighting, Psychic, Rock, Ice, Ghost, Dragon'}
		`(
			'then a invalid pokemons field types "$invalid" should cause error with message "$expectedError"',
			async ({ invalid, expectedError }) => {
				const testBattle = battle()
				const invalidTeam = {
					...team(),
					pokemons: [
						validPokemon(),
						validPokemon(),
						{ ...validPokemon(), types: invalid },
					],
				}

				testBattle.addHomeTeam(invalidTeam)
				testBattle.addAwayTeam(invalidTeam)

				expect(testBattle.hasError).toBe(true)
				expect(testBattle.errors).toEqual([
					{
						message: 'homeTeam: ' + expectedError,
						type: 'validation',
					},
					{
						message: 'awayTeam: ' + expectedError,
						type: 'validation',
					},
				])
			}
		)

		test.each`
			invalid              | expectedError
			${null}              | ${'Optional Pokemon field weaknesses must be an array if defined'}
			${'invalid'}         | ${'Optional Pokemon field weaknesses must be an array if defined'}
			${['invalid']}       | ${'Pokemon weaknesses if defined must only include any of the following types: Grass, Poison, Fire, Flying, Water, Bug, Normal, Electric, Ground, Fighting, Psychic, Rock, Ice, Ghost, Dragon'}
			${['Fire', 'Coder']} | ${'Pokemon weaknesses if defined must only include any of the following types: Grass, Poison, Fire, Flying, Water, Bug, Normal, Electric, Ground, Fighting, Psychic, Rock, Ice, Ghost, Dragon'}
		`(
			'then a invalid pokemons field weaknesses "$invalid" should cause error with message "$expectedError"',
			async ({ invalid, expectedError }) => {
				const testBattle = battle()
				const invalidTeam = {
					...team(),
					pokemons: [
						validPokemon(),
						validPokemon(),
						{ ...validPokemon(), weaknesses: invalid },
					],
				}
				testBattle.addHomeTeam(invalidTeam)
				testBattle.addAwayTeam(invalidTeam)

				expect(testBattle.hasError).toBe(true)
				expect(testBattle.errors).toEqual([
					{
						message: 'homeTeam: ' + expectedError,
						type: 'validation',
					},
					{
						message: 'awayTeam: ' + expectedError,
						type: 'validation',
					},
				])
			}
		)

		test.each`
			invalid      | expectedError
			${null}      | ${'Optional Pokemon field multipliers field must be an array if defined'}
			${'invalid'} | ${'Optional Pokemon field multipliers field must be an array if defined'}
			${[0]}       | ${'If Pokemon multipliers is defined it must only include numbers between 0.001 and 5.000'}
			${[1.3, 0]}  | ${'If Pokemon multipliers is defined it must only include numbers between 0.001 and 5.000'}
		`(
			'then a invalid pokemons field multipliers "$invalid" should cause error with message "$expectedError"',
			async ({ invalid, expectedError }) => {
				const testBattle = battle()
				const invalidTeam = {
					...team(),
					pokemons: [
						validPokemon(),
						validPokemon(),
						{ ...validPokemon(), multipliers: invalid },
					],
				}

				testBattle.addHomeTeam(invalidTeam)
				testBattle.addAwayTeam(invalidTeam)

				expect(testBattle.hasError).toBe(true)
				expect(testBattle.errors).toEqual([
					{
						message: 'homeTeam: ' + expectedError,
						type: 'validation',
					},
					{
						message: 'awayTeam: ' + expectedError,
						type: 'validation',
					},
				])
			}
		)
	})
})
