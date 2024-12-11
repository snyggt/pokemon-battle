import { rethrow } from './errorHandling/rethrow'
import { Services } from './servicePorts'
import { Pokemon } from './servicePorts/pokemonService'

interface QueryPokemonResponse {
	pokemons: Pokemon[]
	status: 'success'
}
export const createQueryPokemonsHandler = ({ pokemonService }: Services) =>
	async function queryPokemonsHandler(): Promise<QueryPokemonResponse> {
		const pokemons = await pokemonService
			.getAll()
			.catch(rethrow('Unexpected error calling pokemonService.getAll'))

		return {
			pokemons,
			status: 'success',
		}
	}
