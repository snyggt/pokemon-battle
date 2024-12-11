import {
	array,
	Describe,
	number,
	string,
	type,
	size,
	boolean,
	optional,
	define,
} from 'superstruct'
import {
	createBattleSimulationHandler,
	CreateBattleSimulationCommand,
} from '@snyggt/pokemon-battle-app/src/createBattleSimulation'
import { inMemoryPokemonService } from '@snyggt/pokemon-battle-infra/src/inMemoryPokemonService'
import { Response, Request, NextFunction } from 'express'

const handleCreateBattleSimulationCommand = createBattleSimulationHandler({
	pokemonService: inMemoryPokemonService,
})

export const createBattleHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const [error, validCommand] = bodySchema.validate(req.body)

		if (!validCommand) {
			res.status(400).json({
				message: error.message,
				success: false,
			})
			return
		}

		const battleResponse =
			await handleCreateBattleSimulationCommand(validCommand)

		res.status(201).json({ success: true, data: battleResponse })
	} catch (error) {
		next(error)
	}
}

const pokemons = size(array(number()), 3)

interface Options {
	simulate?: true
}
const forceSimulation = () =>
	define<true>('forceSimulation', (value: true) =>
		value === true
			? true
			: {
					key: 'simulation',
					message:
						'Expected value true, creating battles without simulation is not supported yet',
					code: 'force-simulation',
				}
	)

const bodySchema: Describe<CreateBattleSimulationCommand & Options> = type({
	simulate: forceSimulation(),
	awayTeam: type({
		trainerId: string(),
		pokemons: pokemons,
	}),
	homeTeam: type({
		trainerId: string(),
		pokemons: pokemons,
	}),
})
