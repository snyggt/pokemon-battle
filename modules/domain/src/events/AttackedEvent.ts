import type { BattleActivePokemon } from '../models/BattleActivePokemon'
import type { EventBase } from './EventBase'

export interface AttackedEvent extends EventBase {
	type: 'attacked'
	payload: {
		attackedPokemon: BattleActivePokemon
		attackedByPokemon: BattleActivePokemon
		damage: number
		turn: number
	}
}
