# Pokémon Battle Specification

This document holds the requirement interpretations for the project.

## Modules

### Pokémon Battle Domain

WorkspaceName: **pokemon-battle-domain**
Dependencies: **none**

Entrypoint: **battle.ts**

Responsible for encapsulating the battle logic and enforce battle and combat rules. Exposes a **battle** aggregate root to run battle commands between two Pokemon **teams**.

Aggregate: Battle

Battle Rules:

- a battle can not begin before two teams is registered
- a battle is over when all pokemons in one team has fainted
- a battle turn is over as soon as any attack is initiated
- a trainer must have a trainer id
- a trainer be provided to make a battle command
- a pokemon must have a Name, A PokedexId
- a pokemon can have zero or more weaknesses
- a pokemon can not attack when it is fainted
- a pokemons initial life is always set to 1000 hp
- a pokemons initial attack strength is always 100 hp damage before multipliers

- a team must have a trainer and three pokemons
- a team can use multiple pokemons with the same PokedexId as long as the unique Id is different
- a team cannot attack if turn is over
- a team can change its pokemon before an attack on the same turn

Combat rules:

- a pokemon with multipliers should add 20 extra damage times all multipliers on each attack
- a pokemon recives 10% more damage for every weaknes that exists the attacking pokemon types
- damage is rounded up to nearest integer
- damage is calculated and applied after a attack is initiated and before next turn begins

The battle aggregate root exposes command and query methods to facilitate the battle

Command Operations

- battle.addHomeTeam(trainer, pokemons)
- battle.addAwayTeam(trainer, pokemons)
- battle.begin() - can battle start? who has the first turn?
- battle.useNextPokemon(trainer)
- battle.attack(trainer)

QueyOperations

- battle.getActivePokemonStats(trainer)
- battle.getBattleStatus() => status
- battle.getEvents() => returns all battle events

Events

- Each successfull operation generates a battle event

### Pokemon Battle App

WorkspaceName: **pokemon-battle-app**
Dependencies: **pokemon-battle-domain**

Responsible for coordinating the battle domain aggregates
Defines and depends on application serivice ports and is not conserned about the implementation and infrastructure for those services

- exposes commands: CreateBattleSimulation
  - runns a simulation until one team is wipded out
- exposes queries: GetAllAvailablePokemons

  - queries all available Pokemons from a readonly `pokemonRepository`

- uses valueObjects from the battle domain to validate application commands and queries
- extracts the domain events and maps them into a structured battle log that is returned as a simulation result

**Nice to have:**

- Make game playable without simulation
  - add CreateBattle command
  - add RunAttack command
  - add ChangePokemon command
  - add ChangePokemon command
  - add GetBattleStats query
  - define a battleRepository to persist a battle aggregate
- add GetBattleSimulationResult
  - queries for a specific battle simulation result

### Pokémon Battle Infra

Name: **pokemon-battle-infra**
External dependencies: **pokemon-battle-domain**,**pokemon-battle-app**, **third party packages**

Responsible for implementing application and core service ports with interchangable adapters.

- implement PokemonService with InMemory implementation

**Nice to have:**

- add MongoDbPokemonService adapter for PokemonService port
- add MongoDbBattleRepository adapter for BattleRepository port

## Interfaces

### Pokemon Battle API

Name: **pokemon-battle-rest-api**
Dependencies:

- **pokemon-battle-app**,
- **pokemon-battle-infra**,
- **third party dependencies to setup infrastructure**

Restful API responsible for

- running the **Pokemon Battle Simulator Application** commands
- query the pokemon repository service for pokemon models

- Parses and maps incoming payloads to Application commands and queries
- Instantiates and passes the choosen adapters to the application ports
- Should return a detailed battle log showing the flow of the battle
- Documented by a swagger endpoint that uses type definitions and tsdoc comments of the api contracts

Exposes restful http enpoints to run the application commands and queries

- POST /api/{version}/battles - Request a new battle
  - payload: { runSimulation?: true } - runSimulation triggers RunBattleSimulation command
- GET /api/{version}/pokemons - Get all available pokemons

**Nice to have:**

- POST /api/{version}/battle - returns a location url to get the battle result
- GET /api/{version}/battle/{id} - Get battle results for a battle id
- GET /api/{version}/pokemons?page={number} - Get paginated results for lazy loading

### Pokemon Battle GUI

Name: **web-app**

Dependencies:

- **pokemon-battle-rest-api**,
- **third party dependencies**

Single page web app to build pokemon teams and run battle simulations.

- Run simulation action
  - render a "Run Simultation" button
  - validate team state, if valid, send runSimulation command on click
  - button should always be visible but show a error if teams is not ready
- Show battle simulation result
  - on run simulation results
  - render the battle log in place of pokemon grid
  - on error show error message
- Render a grid of available pokemons
  - fetch all avalable pokemons and render cards for each
- Render a team section with three slots for pokemons on each team
  - render two teams with three empty slots each
- Add pokemons to teams
  - render two buttons under each pokemon that is visible on hover
  - to add pokemons to a team, click on either a red or blue add button
  - if a team is full, the button should not do anything
- Add "Reset teams" action
  - render a run simultation button
  - validate team state, if valid, send runSimulation command on click
- Add "Remove Pokemon" action
  - render a remove button on hover over a team pokemon
  - remove the pokemon on klick

**Nice to have:**

- change pokemon team order
- add filter to pokemon grid
- persist battle results
- load old battle results
- lazy load pokemon grid with fallback components
- add image optimizer and image cache

### Pokemon Battle Api Documentation

Name: **doc-api**

External dependencies:

- **rest-api**,
- **third party dependencies**

Requirements

- generates documentation based on _rest-api_ contracts and api routes
- hosts and renders a OpenAPI UI to discover the _rest-api_
