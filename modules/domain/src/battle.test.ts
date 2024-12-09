import { battle, Team, Pokemon } from './battle'

const validPokemon: (overrides?: Partial<Pokemon>) => Pokemon = ({
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

const team: (name?: string) => Team = (name = 'testTrainer') => ({
	trainer: { name },
	pokemons: [validPokemon(), validPokemon(), validPokemon()],
})

describe('given a new battle', () => {
	test('then game should not be ended', async () => {
		const testBattle = battle()

		expect(testBattle.currentAttackingTrainer).toBe(undefined)
	})

	test('then battle should not have started', async () => {
		const testBattle = battle()

		expect(testBattle.started).toBe(false)
	})
})

describe('given a new battle - when battle is started', () => {
	test('then count should be 1', async () => {
		const testBattle = battle()

		testBattle.addAwayTeam(team('awayTrainer'))
		testBattle.addHomeTeam(team('homeTrainer'))
		testBattle.begin()
		const currentTurn = testBattle.currentTurn

		expect(currentTurn).toBe(1)
	})

	test('then trainer name should be home team trainer', async () => {
		const testBattle = battle()

		testBattle.addAwayTeam(team('awayTrainer'))
		testBattle.addHomeTeam(team('homeTrainer'))
		testBattle.begin()
		const currentTurnTrainerName = testBattle.currentAttackingTrainer

		expect(currentTurnTrainerName).toBe('homeTrainer')
	})
})

describe('given a new battle - when battle is started - and 10 rounds is played', () => {
	test('then one scores should be available', async () => {
		const testBattle = battle()

		testBattle.addAwayTeam(team('awayTrainer'))
		testBattle.addHomeTeam(team('homeTrainer'))
		testBattle.begin()

		new Array(29).fill('').forEach(() => {
			testBattle.selectTeam('homeTrainer').attack()
			testBattle.selectTeam('awayTrainer').attack()
		})
		testBattle.selectTeam('homeTrainer').attack()

		expect(testBattle.battleScores.homeTeam.activePokemon?.health).toBe(100)
		expect(testBattle.battleScores.homeTeam.activePokemon?.health).toBe(100)
		expect(testBattle.battleScores.ended).toBe(true)
	})
})
describe('given a new battle - and both teams are added - when trying to start the battle', () => {
	test('then battle should be started', async () => {
		const testBattle = battle()

		testBattle.addAwayTeam(team('awayTrainer'))
		testBattle.addHomeTeam(team('homeTrainer'))
		testBattle.begin()

		expect(testBattle.started).toBe(true)
	})
})

describe('given a new battle - battle has started - when checking currentAttackingTrainer', () => {
	test('then the homeTeam trainer name should be returned', async () => {
		const testBattle = battle()

		const homeTeam = team('homeTrainer')
		testBattle.addAwayTeam(team('awayTrainer'))
		testBattle.addHomeTeam(homeTeam)
		testBattle.begin()

		expect(testBattle.currentAttackingTrainer).toBe(homeTeam.trainer.name)
	})
})

describe('given a new battle - and battle has started - and home team trainer commands an attack', () => {
	test('then the currentAttackingTrainer should be away team trainer and turn should be 2', async () => {
		const testBattle = battle()

		const homeTeam = team('homeTrainer')
		const awayTeam = team('awayTrainer')

		testBattle.addAwayTeam(awayTeam)
		testBattle.addHomeTeam(homeTeam)
		testBattle.begin()
		testBattle.selectTeam(homeTeam.trainer.name).attack()

		expect(testBattle.currentAttackingTrainer).toBe(awayTeam.trainer.name)
		expect(testBattle.currentTurn).toBe(2)
	})

	test('then the oponent teams active pokemon health should be lower than before the attack', async () => {
		const homeTeam = team('homeTrainer')
		const awayTeam = team('awayTrainer')

		const testBattle = battle()
		testBattle.addAwayTeam(awayTeam)
		testBattle.addHomeTeam(homeTeam)
		testBattle.begin()
		const teamActions = testBattle.selectTeam(homeTeam.trainer.name)
		const oponentPokemonHealthBefore = teamActions.oponentPokemonHealth
		teamActions.attack()

		expect(testBattle.currentAttackingTrainer).toBe(awayTeam.trainer.name)
		expect(testBattle.currentTurn).toBe(2)
		expect(teamActions.oponentPokemonHealth).toBeLessThan(
			oponentPokemonHealthBefore
		)
	})
})

describe('when adding a valid homeTeam', () => {
	test('no errors should exist', async () => {
		const testBattle = battle()

		testBattle.addHomeTeam(team())
	})
})

describe('given a new battle -  when adding a valid home team if home team already exists', () => {
	test('then a error should have been thrown', async () => {
		const testBattle = battle()

		testBattle.addHomeTeam(team())
		const shouldThrow = () => testBattle.addHomeTeam(team())

		expect(shouldThrow).toThrow(new Error('Home team cannot be added twise'))
	})
})

describe('given a new battle - when adding a valid away team if away team already exists', () => {
	test('then a forbidden error should exist', async () => {
		const testBattle = battle()

		testBattle.addAwayTeam(team())
		const shouldThrow = () => testBattle.addAwayTeam(team())

		expect(shouldThrow).toThrow(new Error('Away team cannot be added twise'))
	})
})

describe('given a new battle - when adding home team and away team with same trainer name', () => {
	test('then a forbidden error should exist', async () => {
		const testBattle = battle()

		testBattle.addAwayTeam(team())
		const shouldThrow = () => testBattle.addHomeTeam(team())

		expect(shouldThrow).toThrow(
			new Error('Team trainers must have different trainer names')
		)
	})
})

describe('given a new battle - when adding away team and home team with same trainer name exists', () => {
	test('then a forbidden error should exist', async () => {
		const testBattle = battle()

		testBattle.addHomeTeam(team())
		const shouldThrow = () => testBattle.addAwayTeam(team())

		expect(shouldThrow).toThrow(
			new Error('Team trainers must have different trainer names')
		)
	})
})

describe('given a new battle - when trying to start the battle before both teams exist', () => {
	test('then a forbidden error should exist', async () => {
		const testBattle = battle()

		const shouldThrow = () => testBattle.begin()

		expect(shouldThrow).toThrow(
			new Error('Battle must have two teams to begin')
		)
		expect(testBattle.started).toBe(false)
	})
})

const createArray = (num: number) => new Array(num).fill('')

describe('given a new battle - when adding a invalid home and away team', () => {
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

			const shouldThrowHomeTeam = () => testBattle.addHomeTeam(invalid)
			const shouldThrowAwayTeam = () => testBattle.addAwayTeam(invalid)

			expect(shouldThrowHomeTeam).toThrow(new Error(expectedError))
			expect(shouldThrowAwayTeam).toThrow(new Error(expectedError))
			expect(testBattle.started).toBe(false)
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

			const shouldThrowHomeTeam = () => testBattle.addHomeTeam(invalidTeam)
			const shouldThrowAwayTeam = () => testBattle.addAwayTeam(invalidTeam)

			expect(shouldThrowHomeTeam).toThrow(new Error(expectedError))
			expect(shouldThrowAwayTeam).toThrow(new Error(expectedError))
			expect(testBattle.started).toBe(false)
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

			const shouldThrowHomeTeam = () => testBattle.addHomeTeam(invalidTeam)
			const shouldThrowAwayTeam = () => testBattle.addAwayTeam(invalidTeam)

			expect(shouldThrowHomeTeam).toThrow(new Error(expectedError))
			expect(shouldThrowAwayTeam).toThrow(new Error(expectedError))
			expect(testBattle.started).toBe(false)
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

			const shouldThrowHomeTeam = () => testBattle.addHomeTeam(invalidTeam)
			const shouldThrowAwayTeam = () => testBattle.addAwayTeam(invalidTeam)

			expect(shouldThrowHomeTeam).toThrow(new Error(expectedError))
			expect(shouldThrowAwayTeam).toThrow(new Error(expectedError))
			expect(testBattle.started).toBe(false)
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

			const shouldThrowHomeTeam = () => testBattle.addHomeTeam(invalidTeam)
			const shouldThrowAwayTeam = () => testBattle.addAwayTeam(invalidTeam)

			expect(shouldThrowHomeTeam).toThrow(new Error(expectedError))
			expect(shouldThrowAwayTeam).toThrow(new Error(expectedError))
			expect(testBattle.started).toBe(false)
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
			const shouldThrowHomeTeam = () => testBattle.addHomeTeam(invalidTeam)
			const shouldThrowAwayTeam = () => testBattle.addAwayTeam(invalidTeam)

			expect(shouldThrowHomeTeam).toThrow(new Error(expectedError))
			expect(shouldThrowAwayTeam).toThrow(new Error(expectedError))
			expect(testBattle.started).toBe(false)
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

			const shouldThrowHomeTeam = () => testBattle.addHomeTeam(invalidTeam)
			const shouldThrowAwayTeam = () => testBattle.addAwayTeam(invalidTeam)

			expect(shouldThrowHomeTeam).toThrow(new Error(expectedError))
			expect(shouldThrowAwayTeam).toThrow(new Error(expectedError))
			expect(testBattle.started).toBe(false)
		}
	)
})
