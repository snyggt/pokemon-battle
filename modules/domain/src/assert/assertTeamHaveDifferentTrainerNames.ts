import { assert } from '.'

export function assertTeamsHaveDifferentTrainerNames(
	firstTrainerName: string | undefined,
	sedcondTrainerName: string
) {
	assert(
		!firstTrainerName || sedcondTrainerName !== firstTrainerName,
		'Team trainers must have different trainer names'
	)
}
