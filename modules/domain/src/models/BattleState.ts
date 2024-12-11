import type { TeamType } from './TeamType'

export interface BattleState {
	id: string
	turn?: { count: number; attackingTeaam: TeamType }
	started: boolean
}
