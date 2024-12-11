import { rethrow } from './errorHandling/rethrow'
import { Services } from './servicePorts'
import { Pokemon } from './servicePorts/pokemonService'

interface QueryPokemonResponse {
	pokemons: Pokemon[]
	status: 'success'
}

export interface QueryPokemonFilter {
	typesPattern?: string
}

export const createQueryPokemonsHandler = ({ pokemonService }: Services) =>
	async function queryPokemonsHandler(
		filter: QueryPokemonFilter
	): Promise<QueryPokemonResponse> {
		const pokemons = await pokemonService
			.getAll(filter)
			.catch(rethrow('Unexpected error calling pokemonService.getAll'))

		return {
			pokemons,
			status: 'success',
		}
	}
