import { battle } from './battle'

describe('given a new battle', () => {
	describe('when checking if game is completed', () => {
		test('then it should return false', async () => {
			const testBattle = battle()

			expect(testBattle.gameCompleted).toBe(false)
		})
	})
})
