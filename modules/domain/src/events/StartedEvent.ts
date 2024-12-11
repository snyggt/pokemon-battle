import { BattleActivePokemon } from '../models/BattleActivePokemon'
import { BattleState } from '../models/BattleState'
import { EventBase } from './EventBase'

export interface StartedEvent extends EventBase {
	type: 'started'
	payload: {
		battleState: BattleState
		homeTeam: BattleActivePokemon[]
		awayTeam: BattleActivePokemon[]
	}
}
