interface Team {
	trainer: Trainer
	pokemons: Pokemon[]
}

interface Pokemon {
	name: string
	pokedexId: number
	multipliers: number[]
	weaknesses: string[]
	type: string[]
}

interface Trainer {
	name: string
}

interface BattleActivePokemon extends Pokemon {
	health: number
}

interface BattleState {
	homeTeam?: { trainer?: Trainer; pokemons?: BattleActivePokemon[] }
	awayTeam?: { trainer?: Trainer; pokemons?: BattleActivePokemon[] }
	gameCompleted: boolean
}

export const battle = () => {
	const battleState: BattleState = { gameCompleted: false }

	return {
		get gameCompleted() {
			return battleState.gameCompleted
		},
	}
}
