import { createBattleHandler } from './battleRequestHandler'

const mockedRes = {
	status: jest.fn().mockReturnThis(),
	json: jest.fn(),
}
const mockedNext = jest.fn()

beforeEach(() => {
	mockedRes.status.mockReturnThis()
	mockedRes.json.mockReset()
})

describe('createBattleHandler', () => {
	test('success', async () => {
		const mockedReq = {
			body: {
				simulate: true,
				homeTeam: validTeam('Erik'),
				awayTeam: validTeam('Johan'),
			},
		}

		await createBattleHandler(mockedReq as any, mockedRes as any, mockedNext)

		expect(mockedRes.status).toHaveBeenCalledWith(201)
		expect(mockedRes.json).toHaveBeenCalledWith({
			success: true,
			data: expect.any(Object),
		})
	})
})

describe('invalid payload', () => {
	test.each`
		invalid             | testDescription               | expectedError
		${undefined}        | ${'undefined'}                | ${'Expected an object, but received: undefined'}
		${null}             | ${'null'}                     | ${'Expected an object, but received: null'}
		${0}                | ${'0'}                        | ${'Expected an object, but received: 0'}
		${[]}               | ${'empty array'}              | ${'Expected an object, but received: '}
		${[1]}              | ${'one items number array'}   | ${'Expected an object, but received: 1'}
		${[1, 2]}           | ${'two items number array'}   | ${'Expected an object, but received: 1,2'}
		${[1, 2, 3]}        | ${'three items number array'} | ${'Expected an object, but received: 1,2,3'}
		${''}               | ${'emptyString'}              | ${'Expected an object, but received: ""'}
		${'text'}           | ${'"text" string'}            | ${'Expected an object, but received: "text"'}
		${Number.MAX_VALUE} | ${'big number'}               | ${'Expected an object, but received: 1.7976931348623157e+308'}
	`(
		'[body] "$testDescription" should result in a 400 (Bad Request)',
		async ({ invalid, expectedError }) => {
			const mockedReq = {
				body: invalid,
			}
			await createBattleHandler(mockedReq as any, mockedRes as any, mockedNext)

			expect(mockedRes.status).toHaveBeenCalledWith(400)
			expect(mockedRes.json).toHaveBeenCalledWith({
				message: expectedError,
				success: false,
			})
		}
	)

	test.each`
		invalid             | testDescription               | expectedError
		${undefined}        | ${'undefined'}                | ${'At path: awayTeam.trainerId -- Expected a string, but received: undefined'}
		${null}             | ${'null'}                     | ${'At path: awayTeam.trainerId -- Expected a string, but received: null'}
		${0}                | ${'0'}                        | ${'At path: awayTeam.trainerId -- Expected a string, but received: 0'}
		${[]}               | ${'empty array'}              | ${'At path: awayTeam.trainerId -- Expected a string, but received: '}
		${[1]}              | ${'one items number array'}   | ${'At path: awayTeam.trainerId -- Expected a string, but received: 1'}
		${[1, 2]}           | ${'two items number array'}   | ${'At path: awayTeam.trainerId -- Expected a string, but received: 1,2'}
		${[1, 2, 3]}        | ${'three items number array'} | ${'At path: awayTeam.trainerId -- Expected a string, but received: 1,2,3'}
		${Number.MAX_VALUE} | ${'big number'}               | ${'At path: awayTeam.trainerId -- Expected a string, but received: 1.7976931348623157e+308'}
		${[]}               | ${'empty pokemons array'}     | ${'At path: awayTeam.trainerId -- Expected a string, but received: '}
	`(
		'[awayTeam.trainerId] "$testDescription" should result in a 400 (Bad Request)"',
		async ({ invalid, expectedError }) => {
			mockedRes.json.mockReset()
			const mockedReq = {
				body: {
					awayTeam: { ...validTeam('Erik'), trainerId: invalid },
					homeTeam: validTeam('Johan'),
					simulate: true,
				},
			}
			await createBattleHandler(mockedReq as any, mockedRes as any, mockedNext)

			expect(mockedRes.status).toHaveBeenCalledWith(400)
			expect(mockedRes.json).toHaveBeenCalledWith({
				message: expectedError,
				success: false,
			})
		}
	)

	test.each`
		invalid              | testDescription                          | expectedError
		${undefined}         | ${'undefined'}                           | ${'At path: awayTeam -- Expected an object, but received: undefined'}
		${null}              | ${'null'}                                | ${'At path: awayTeam -- Expected an object, but received: null'}
		${0}                 | ${'0'}                                   | ${'At path: awayTeam -- Expected an object, but received: 0'}
		${[]}                | ${'empty array'}                         | ${'At path: awayTeam -- Expected an object, but received: '}
		${[1]}               | ${'one items number array'}              | ${'At path: awayTeam -- Expected an object, but received: 1'}
		${[1, 2]}            | ${'two items number array'}              | ${'At path: awayTeam -- Expected an object, but received: 1,2'}
		${[1, 2, 'invalid']} | ${'three items number and string array'} | ${'At path: awayTeam -- Expected an object, but received: 1,2,invalid'}
		${''}                | ${'emptyString'}                         | ${'At path: awayTeam -- Expected an object, but received: ""'}
		${'text'}            | ${'"text" string'}                       | ${'At path: awayTeam -- Expected an object, but received: "text"'}
		${Number.MAX_VALUE}  | ${'big number'}                          | ${'At path: awayTeam -- Expected an object, but received: 1.7976931348623157e+308'}
		${[]}                | ${'empty pokemons array'}                | ${'At path: awayTeam -- Expected an object, but received: '}
		${[]}                | ${'empty pokemons array'}                | ${'At path: awayTeam -- Expected an object, but received: '}
	`(
		'[awayTeam] "$testDescription" should result in a 400 (Bad Request) with message',
		async ({ invalid, expectedError }) => {
			const mockedReq = {
				body: {
					awayTeam: invalid,
					homeTeam: validTeam('Johan'),
					simulate: true,
				},
			}
			await createBattleHandler(mockedReq as any, mockedRes as any, mockedNext)

			expect(mockedRes.status).toHaveBeenCalledWith(400)
			expect(mockedRes.json).toHaveBeenCalledWith({
				message: expectedError,
				success: false,
			})
		}
	)

	test.each`
		invalid             | testDescription               | expectedError
		${undefined}        | ${'undefined'}                | ${'At path: awayTeam.pokemons -- Expected an array value, but received: undefined'}
		${null}             | ${'null'}                     | ${'At path: awayTeam.pokemons -- Expected an array value, but received: null'}
		${0}                | ${'0'}                        | ${'At path: awayTeam.pokemons -- Expected an array value, but received: 0'}
		${[]}               | ${'empty array'}              | ${'At path: awayTeam.pokemons -- Expected a array with a length of `3` but received one with a length of `0`'}
		${[1]}              | ${'one items number array'}   | ${'At path: awayTeam.pokemons -- Expected a array with a length of `3` but received one with a length of `1`'}
		${[1, 2]}           | ${'two items number array'}   | ${'At path: awayTeam.pokemons -- Expected a array with a length of `3` but received one with a length of `2`'}
		${[1, 2, 'hej']}    | ${'three items number array'} | ${'At path: awayTeam.pokemons.2 -- Expected a number, but received: "hej"'}
		${Number.MAX_VALUE} | ${'big number'}               | ${'At path: awayTeam.pokemons -- Expected an array value, but received: 1.7976931348623157e+308'}
		${[]}               | ${'empty pokemons array'}     | ${'At path: awayTeam.pokemons -- Expected a array with a length of `3` but received one with a length of `0`'}
	`(
		'[awayTeam.pokemons] "$testDescription" should result in a 400 (Bad Request)',
		async ({ invalid, expectedError }) => {
			const mockedReq = {
				body: {
					awayTeam: { ...validTeam('Erik'), pokemons: invalid },
					homeTeam: validTeam('Johan'),
					simulate: true,
				},
			}
			await createBattleHandler(mockedReq as any, mockedRes as any, mockedNext)

			expect(mockedRes.status).toHaveBeenCalledWith(400)
			expect(mockedRes.json).toHaveBeenCalledWith({
				message: expectedError,
				success: false,
			})
		}
	)

	test.each`
		invalid              | testDescription                          | expectedError
		${undefined}         | ${'undefined'}                           | ${'At path: homeTeam -- Expected an object, but received: undefined'}
		${null}              | ${'null'}                                | ${'At path: homeTeam -- Expected an object, but received: null'}
		${0}                 | ${'0'}                                   | ${'At path: homeTeam -- Expected an object, but received: 0'}
		${[]}                | ${'empty array'}                         | ${'At path: homeTeam -- Expected an object, but received: '}
		${[1]}               | ${'one items number array'}              | ${'At path: homeTeam -- Expected an object, but received: 1'}
		${[1, 2]}            | ${'two items number array'}              | ${'At path: homeTeam -- Expected an object, but received: 1,2'}
		${[1, 2, 'invalid']} | ${'three items number and string array'} | ${'At path: homeTeam -- Expected an object, but received: 1,2,invalid'}
		${''}                | ${'emptyString'}                         | ${'At path: homeTeam -- Expected an object, but received: ""'}
		${'text'}            | ${'"text" string'}                       | ${'At path: homeTeam -- Expected an object, but received: "text"'}
		${Number.MAX_VALUE}  | ${'big number'}                          | ${'At path: homeTeam -- Expected an object, but received: 1.7976931348623157e+308'}
		${[]}                | ${'empty pokemons array'}                | ${'At path: homeTeam -- Expected an object, but received: '}
		${[]}                | ${'empty pokemons array'}                | ${'At path: homeTeam -- Expected an object, but received: '}
	`(
		'[homeTeam] "$testDescription" should result in a 400 (Bad Request)',
		async ({ invalid, expectedError }) => {
			mockedRes.status.mockReturnThis()
			mockedRes.json.mockReset()
			const mockedReq = {
				body: {
					homeTeam: invalid,
					awayTeam: validTeam('Johan'),
					simulate: true,
				},
			}

			await createBattleHandler(mockedReq as any, mockedRes as any, mockedNext)

			expect(mockedRes.status).toHaveBeenCalledWith(400)
			expect(mockedRes.json).toHaveBeenCalledWith({
				message: expectedError,
				success: false,
			})
		}
	)

	test.each`
		invalid             | testDescription             | expectedError
		${undefined}        | ${'undefined'}              | ${'At path: homeTeam.pokemons -- Expected an array value, but received: undefined'}
		${null}             | ${'null'}                   | ${'At path: homeTeam.pokemons -- Expected an array value, but received: null'}
		${0}                | ${'0'}                      | ${'At path: homeTeam.pokemons -- Expected an array value, but received: 0'}
		${[]}               | ${'empty array'}            | ${'At path: homeTeam.pokemons -- Expected a array with a length of `3` but received one with a length of `0`'}
		${[1]}              | ${'one items number array'} | ${'At path: homeTeam.pokemons -- Expected a array with a length of `3` but received one with a length of `1`'}
		${[1, 2]}           | ${'two items number array'} | ${'At path: homeTeam.pokemons -- Expected a array with a length of `3` but received one with a length of `2`'}
		${Number.MAX_VALUE} | ${'big number'}             | ${'At path: homeTeam.pokemons -- Expected an array value, but received: 1.7976931348623157e+308'}
	`(
		'[homeTeam.pokemons] "$testDescription" result in a 400 (Bad Request) with message',
		async ({ invalid, expectedError }) => {
			mockedRes.status.mockReturnThis()
			mockedRes.json.mockReset()
			const mockedReq = {
				body: {
					homeTeam: { ...validTeam('Erik'), pokemons: invalid },
					awayTeam: validTeam('Johan'),
					simulate: true,
				},
			}
			await createBattleHandler(mockedReq as any, mockedRes as any, mockedNext)

			expect(mockedRes.status).toHaveBeenCalledWith(400)
			expect(mockedRes.json).toHaveBeenCalledWith({
				message: expectedError,
				success: false,
			})
		}
	)
})

const validTeam = (name = 'trainerName') => ({
	trainerId: name,
	pokemons: [1, 2, 3],
})
