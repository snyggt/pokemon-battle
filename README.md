# Pokémon Battle Simulator

## Planning

This is a coding challenge described in [challenge.md](/docs/challenge.md)

- Read about the planned structure of this repository here in [structure.md](/docs/structure.md)
- My interpretations of the challenge is documented in [specification.md](/docs/specification.md)

## Get started

### Clone

Clone this repository

```bash
git clone git@github.com:snyggt/pokemon-battle.git && \
cd pokemon-battle
```

### Install

**This repository is using pnpm as its package manager.** Follow [install instructions](https://pnpm.io/installation)

Install all dependencies needed for the project, make sure you are standing in the root directory.

```bash
pnpm install
```

### Build

Run build scripts on all workspaces.

```bash
pnpm run build
```

### Run tests

Run tests in all workspaces. Good for verifying, but it outputs a collapsed summery of all tests

```bash
pnpm run test
```

To get a better overview over the test cases; run tests for each workspace.

for `modules/domain` workspace:

```bash
pnpm run test:domain
```

for `modules/app` workspace:

```bash
pnpm run test:app
```

for `modules/infra` workspace:

```bash
pnpm run test:infra
```

for `services/rest-api` workspace:

```bash
pnpm run test:api
```

### Run lint

Run lint check in all workspaces.

```bash
pnpm run lint
```

### Start dev environment

To start all dev environments, (at this point there is only one service `services/rest-api`)

```bash
pnpm run dev
```

Try out the endpoint by sending a http request

`POST: /api/v1/battle`

Curl example:
**Create Battle Simulation**: Replace awayTeam.pokemons and homeTeam.pokemons numbers with anything between 1 - 151 to simulate diffrent battles.

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
        "trainerName": "Erik"
    },
    "homeTeam": {
        "pokemons": [
            44,
            33,
            2
        ],
        "trainerName": "Johan"
    },
    "simulate":true
}'
```

**Query Pokemons**

GET:/api/v1/pokemon
Query all pokemons

```bash
curl --location 'localhost:3000/api/v1/pokemon' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \

```

Query with filter by type, (just one filter is supported right now)

```bash
curl --location 'localhost:3000/api/v1/pokemon?type=fire' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \

```

Simple backlog to keep track of the project progress

### Docs

- [x] Add README.md
- [x] Add [challenge.md](/docs/challenge.md) description
- [x] Add sample data [pokedex.json](/docs/sample-data/pokedex.json)
- [x] Add [specification.md](/docs/specification.md)
- [x] Create tasks from [specification.md](/docs/specification.md)
- [x] Prioritize tasks in README.md based on personal timelimit

### Boilerplating

- [x] Define project workspace structure [structure.md](/docs/structure.md)
- [x] setup monorepo structure
- [x] setup configuration
- [x] For each workspace
  - [x] Setup build configuration
  - [x] Setup lint / style configuration
  - [x] Setup test configuration

### Features

1. [x] Battle Simulation
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
3. [x] Add QeryPokemons endpoint
4. [x] Add filter to QueryAllPokemons
5. [ ] Dockerize the battle API
6. [ ] Add Pokemon Battle GUI for presentation
7. [ ] Dockerize the battle GUI with reverse proxy
