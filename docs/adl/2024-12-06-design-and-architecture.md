# Record 2024-12-06, design and architecture

## Context
In the first stage of this project a initial architecture and design aproach needs to be taken to avoid big structural changes during development. The MVP timeframe approximately 5 h so its important to not have to make big changes during development

## Decision
The project will be structured with a [hexagon architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)) and the core game rules will be isolated in modules with concepts from [Domain-driven design (DDD)](https://en.wikipedia.org/wiki/Domain-driven_design)

## Consequences
There will be a overhead for this design desicion compared to a more POC aproach, resulting in less time to implement nice to have features.
