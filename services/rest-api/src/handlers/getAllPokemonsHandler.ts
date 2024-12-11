import { createQueryPokemonsHandler } from '@snyggt/pokemon-battle-app/src/queryPokemonsHandler'
import { inMemoryPokemonService } from '@snyggt/pokemon-battle-infra/src/inMemoryPokemonService'
import { Response, Request, NextFunction } from 'express'

const queryPokemons = createQueryPokemonsHandler({
	pokemonService: inMemoryPokemonService,
})

export const getAllPokemonsHandler = async (
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const pokemonsResponse = await queryPokemons()

		res.status(200).json({ success: true, data: pokemonsResponse })
	} catch (error) {
		next(error)
	}
}
