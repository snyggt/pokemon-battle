import {
	array,
	Describe,
	number,
	string,
	type,
	size,
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

export const postCreateBattleHandler = async (
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
	define<true | undefined>('simulation', (value: unknown) =>
		value === true
			? true
			: {
					key: 'simulation',
					message:
						'Expected value true, creating battles without simulation is not supported yet',
				}
	)

const bodySchema: Describe<CreateBattleSimulationCommand & Options> = type({
	simulate: forceSimulation(),
	awayTeam: type({
		trainerName: string(),
		pokemons,
	}),
	homeTeam: type({
		trainerName: string(),
		pokemons,
	}),
})
