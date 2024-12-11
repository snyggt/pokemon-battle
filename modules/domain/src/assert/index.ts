import { panic } from '../errorHandling'

export function assert(condition: unknown, message: string): asserts condition {
	if (!condition) {
		panic(message, { removeCallerFromStack: true })
	}
}
