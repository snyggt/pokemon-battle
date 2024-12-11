import { BattleActivePokemon } from '../models/BattleActivePokemon'
import { TeamType } from '../models/TeamType'
import { Trainer } from '../models/Trainer'
import { EventBase } from './EventBase'

export interface TeamJoinedEvent extends EventBase {
	type: 'team-joined'
	payload: {
		teamType: TeamType
		pokemons: BattleActivePokemon[]
		trainer: Trainer
	}
}
