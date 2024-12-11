import { getQueryPokemonsHandler } from './getQueryPokemonsHandler'

const mockedRes = {
	status: jest.fn().mockReturnThis(),
	json: jest.fn(),
}
const mockedNext = jest.fn()

beforeEach(() => {
	mockedRes.status.mockReset()
	mockedRes.status.mockReturnThis()
	mockedRes.json.mockReset()
})

describe('getAllPokemonsHandler', () => {
	test('success', async () => {
		await getQueryPokemonsHandler(
			{ query: { type: 'foo' } } as any,
			mockedRes as any,
			mockedNext
		)

		expect(mockedRes.status).toHaveBeenCalledWith(200)
		expect(mockedRes.json).toHaveBeenCalledWith({
			success: true,
			data: expect.any(Object),
		})
	})

	test.each`
		invalid           | expectedMessage
		${null}           | ${'At path: type -- Expected a string, but received: null'}
		${[]}             | ${'At path: type -- Expected a string, but received: '}
		${['foo', 'bar']} | ${'At path: type -- Expected a string, but received: foo,bar'}
		${1}              | ${'At path: type -- Expected a string, but received: 1'}
	`(
		'invalid type $invalid fails with message "$expectedMessage"',
		async ({ invalid, expectedMessage }) => {
			await getQueryPokemonsHandler(
				{ query: { type: invalid } } as any,
				mockedRes as any,
				mockedNext
			)

			expect(mockedRes.status).toHaveBeenCalledWith(400)
			expect(mockedRes.json).toHaveBeenCalledWith({
				success: false,
				message: expectedMessage,
			})
		}
	)
})
