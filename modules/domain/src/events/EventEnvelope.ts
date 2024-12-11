import type { EventBase } from './EventBase'

export interface EventEnvelope<T extends EventBase> {
	id: string
	timestamp: Date
	revision: number
	payload: T['payload']
	type: T['type']
}
