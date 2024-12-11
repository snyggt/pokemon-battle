import type { BattleActivePokemon } from '../models/BattleActivePokemon'
import type { BattleState } from '../models/BattleState'
import type { EventBase } from './EventBase'

export interface EndedEvent extends EventBase {
	type: 'ended'
	payload: {
		battleState: BattleState
		homeTeam: BattleActivePokemon[]
		awayTeam: BattleActivePokemon[]
	}
}
