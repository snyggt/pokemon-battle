# Project structure

This document describes the planned project structure and key concepts.

## Monorepo structure

pokemon-battle/
├── modules/
│ ├── domain/ # workspace
│ └── app/ # workspace
│ └── infra/ # workspace
├── interfaces/
│ ├── rest-api/ # workspace
│ ├── **doc-api/** # workspace - Nice to have
│ └── **web-app/** # workspace - Nice to have
├── docs/
│ ├── sample-data/
│ ├── challenge.md
│ ├── structure.md
│ └── specification.md
├── package.json
├── pnpm-lock.json
├── pnpm-worspaces.yaml
└── README.md

One main goal for this project is to keep the structure as simple and clean as possible but still with clear boundaries and separation of concerns.

The solution will take a DDD aproach but only with enough concepts needed to complete the solution.

The domain layer will be using classes for encapsulation and strong data integrity and the rest of the project will be implemented with a more functional coding style.

Each module and interface will be its own workspace with its own dependencies, configuration and lifecycle.

### Nice to have:

**doc-api** that depends on the rest-api to:

- generate documentation from the rest-api typescript contracts
- hosts a OpenAPI ui for api discovery

**web-app** The next one will be a web GUI that:

- Lists all available Pokemon in a grid view
- Enables the users to populates two teams with three pokemons each
- interacts with the rest-api to run simulations
- Shows the simulation result

The plan is to build it as a SPA app with only one route

- Vite
- React or Preact
- And a CSS-in-js library
- use fetch or swr to interact with the api
- tested with jest, react-testing-library and msw
