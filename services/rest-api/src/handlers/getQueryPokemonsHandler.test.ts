import { getQueryPokemonsHandler } from './getQueryPokemonsHandler'

const mockedRes = {
	status: jest.fn().mockReturnThis(),
	json: jest.fn(),
}
const mockedNext = jest.fn()

beforeEach(() => {
	mockedRes.status.mockReturnThis()
	mockedRes.json.mockReset()
})

describe('getAllPokemonsHandler', () => {
	test('success', async () => {
		await getQueryPokemonsHandler({} as any, mockedRes as any, mockedNext)

		expect(mockedRes.status).toHaveBeenCalledWith(200)
		expect(mockedRes.json).toHaveBeenCalledWith({
			success: true,
			data: expect.any(Object),
		})
	})
})
