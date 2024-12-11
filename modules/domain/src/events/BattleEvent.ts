import type { AttackedEvent } from './AttackedEvent'
import type { EndedEvent } from './EndedEvent'
import type { StartedEvent } from './StartedEvent'
import type { TeamJoinedEvent } from './TeamJoinedEvent'

export type BattleEvent =
	| AttackedEvent
	| StartedEvent
	| TeamJoinedEvent
	| EndedEvent
