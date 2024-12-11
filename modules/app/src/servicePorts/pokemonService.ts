export interface PokemonService {
	getByIds: (id: number[]) => Promise<Pokemon[]>
	getAll: () => Promise<Pokemon[]>
}

export interface Pokemon {
	pokedexId: number
	types: string[]
	name: string
	img: string
	height: string
	weight: string
	multipliers: number[]
	weaknesses: string[]
}
