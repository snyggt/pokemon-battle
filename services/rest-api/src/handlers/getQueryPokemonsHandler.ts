import { createQueryPokemonsHandler } from '@snyggt/pokemon-battle-app/src/queryPokemonsHandler'
import { inMemoryPokemonService } from '@snyggt/pokemon-battle-infra/src/inMemoryPokemonService'
import { Response, Request, NextFunction } from 'express'
import { Describe, optional, string, type } from 'superstruct'

const queryPokemons = createQueryPokemonsHandler({
	pokemonService: inMemoryPokemonService,
})

export const getQueryPokemonsHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const [error, validQuery] = querySchema.validate(req.query)
		if (!validQuery) {
			res.status(400).json({
				message: error.message,
				success: false,
			})
			return
		}
		const pokemonsResponse = await queryPokemons({
			typesPattern: validQuery.type,
		})

		res.status(200).json({ success: true, data: pokemonsResponse })
	} catch (error) {
		next(error)
	}
}

interface QueryFilter {
	type?: string
}
const querySchema: Describe<QueryFilter> = type({
	type: optional(string()),
})
