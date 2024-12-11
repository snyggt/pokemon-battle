# Pokémon Battle Simulator

This is a coding challenge described in [the-challenge.md](/docs/the-challenge.md)

## Get started

### Clone

Clone this repository

```bash
git clone git@github.com:snyggt/pokemon-battle.git && \
cd pokemon-battle
```

### Install

Install all dependencies needed for the project, make sure you are standing in the root folder

```bash
pnpm install
```

### Run tests

Run tests in all workspaces. Good for verifying, but it outputs a collapsed summery of all tests

```bash
pnpm run test
```

To get a better overview over the test cases; run tests for each workspace

for `modules/domain` worspace:

```bash
pnpm run test:domain
```

for `modules/app` worspace:

```bash
pnpm run test:app
```

for `modules/infra` worspace:

```bash
pnpm run test:infra
```

for `services/rest-api` worspace:

```bash
pnpm run test:api
```

### Start dev environment

To start all dev environments, (at this point there is only one service `services/rest-api`)

```bash
pnpm run dev
```

Try out the endpoint by sending a http request

`POST: /api/v1/battle`

Curl example:
Replace awayTeam.pokemons and homeTeam.pokemons numbers with anything between 1 - 151 to simulate diffrent battles.

```bash
curl --location 'localhost:3000/api/v1/battle' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data '{
    "awayTeam": {
        "pokemons": [
            1,
            66,
            77
        ],
        "trainerId": "Erik"
    },
    "homeTeam": {
        "pokemons": [
            44,
            33,
            2
        ],
        "trainerId": "Johan"
    },
    "simulate":true
}'
```

## Planning

- Read about the planned structure of this repository here in [project-structure.md](/docs/project-structure.md)
- My interpretations of the challenge is documented in [project-specification.md](/docs/project-specification.md)

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
   - [x] create new battle with teams and a trainer
   - [x] enforce battle rules required to run simulation until one team looses
   - [x] enforce multiplier combat rules
   - [x] enforce weekness combat rules
   - [x] generate Battle events
   - [x] map battle events to BattleLog
   - [x] add PokemonService port to fetch pokemon data to be used to initiate battle
   - [x] implement InMemoryPokemonService adapter that to serve a inmemory pokemon dataset
   - [x] implement /api/v1/battle {simulate:true}

### Nice To Have Features

2. [ ] Add MongoDB service for dev environment
3. [ ] Add ListAllPokemons query
4. [ ] Dockerize the battle API
5. [ ] Add Pokemon Battle GUI for presentation
6. [ ] Dockerize the battle GUI with reverse proxy
