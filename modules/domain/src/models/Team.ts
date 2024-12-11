import { Pokemon } from './Pokemon'
import type { Trainer } from './Trainer'

export interface TeamDto {
	trainer: Trainer
	pokemons: Pokemon[]
}
