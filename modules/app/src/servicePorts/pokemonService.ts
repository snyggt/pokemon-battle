export interface PokemonService {
	getByIds: (id: number[]) => Promise<Pokemon[]>
	getAll: (filter?: Filter) => Promise<Pokemon[]>
}

export interface Filter {
	typesPattern?: string
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
