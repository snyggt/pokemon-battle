import type { BattleActivePokemon } from './BattleActivePokemon'
import type { Trainer } from './Trainer'

export interface BattleTeam {
	trainer: Trainer
	pokemons: BattleActivePokemon[]
}
