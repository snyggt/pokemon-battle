import { randomUUID } from 'crypto'
import { BattleEvent } from './BattleEvent'
import { EventEnvelope } from './EventEnvelope'

export const createEventEnveloper =
	(events: EventEnvelope<BattleEvent>[]) =>
	<T extends BattleEvent>(e: T) => {
		const eventEnvelope: EventEnvelope<T> = Object.freeze({
			type: e.type,
			payload: Object.freeze({ ...e.payload }),
			id: randomUUID(),
			revision: events.length + 1,
			timestamp: new Date(),
		})

		events.push(eventEnvelope)
	}
