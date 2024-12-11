import { Pokemon } from '../models/Pokemon'
import { TeamDto } from '../models/Team'

export const validPokemon: (overrides?: Partial<Pokemon>) => Pokemon = ({
	pokedexId = 2,
	name = 'Testimon',
	multipliers = [1.1],
	types = ['Fire'],
	weaknesses = [],
} = {}) => ({
	name,
	multipliers,
	pokedexId,
	types,
	weaknesses,
})

export const team: (name?: string) => TeamDto = (name = 'testTrainer') => ({
	trainer: { name },
	pokemons: [validPokemon(), validPokemon(), validPokemon()],
})
