import type { TeamType } from './TeamType'

export interface BattleActivePokemon {
	name: string
	trainerName: string
	teamType: TeamType
	id: string
	pokedexId: number
	multipliers: number[]
	weaknesses: string[]
	types: string[]
	health: number
}
