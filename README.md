# Pokémon Battle Simulator

This is a coding challenge described in [the-challenge.md](/docs/the-challenge.md)

My interpretations of the challenge is documented in [project-specification.md](/docs/project-specification.md)

## Project structure

Read about the planned structure of this repository here in [project-structure.md](/docs/project-structure.md)

## Planning

Simple backlog to keep track of the project progress

### Docs

- [x] Add README.md
- [x] Add [the-challenge.md](/docs/the-challenge.md) description
- [x] Add sample data [pokedex.json](/docs/sample-data/pokedex.json)
- [x] Add [project-specification.md](/docs/project-specification.md)
- [x] Create tasks from [project-specification.md](/docs/project-specification.md)
- [x] Prioritize tasks in README.md based on personal timelimit

### Boilerplating

- [x] Define project workspace structure [project-structure.md](/docs/project-structure.md)
- [x] setup monorepo structure
- [x] setup configuration
- [x] For each workspace
  - [x] Setup build configuration
  - [x] Setup lint / style configuration
  - [x] Setup test configuration

### Features

1. [ ] Battle Simulation
   - [x] add CreateBattleSimulation command handler and implement simulation
   - [ ] create new battle with teams and a trainer
   - [ ] enforce battle rules required to run simulation until one team looses
   - [ ] enforce multiplier combat rules
   - [ ] enforce weekness combat rules
   - [ ] add PokemonService port to fetch pokemon data to be used to initiate battle
   - [ ] implement InMemoryPokemonService adapter that to serve a inmemory pokemon dataset

### Nice To Have Features

2. [ ] Add MongoDB service for dev environment
3. [ ] Add ListAllPokemons query
4. [ ] Dockerize the battle API
5. [ ] Add Pokemon Battle GUI for presentation
6. [ ] Dockerize the battle GUI with reverse proxy
