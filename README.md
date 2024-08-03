## TODO

- Make affectedRoundsLeft correct and clean up when effects should be applied (currently inconsistent).
- use Enum for abilities and inventory items key.
- make outcomes more detailed (?)
- relogin should load last state correctly (make sure serde is correct).
  - use file for saving and loading.
- Implement ability and interaction between them: Illusion, Stun, Stumble, Evade.
  - do this in Battle.generateRoundOutcomesAndSideEffects
- separate round outcomes and applying side effects in Battle.generateRoundOutcomesAndSideEffects
  - outcomes should be before side effects.

## Run in Local

- npm install
- npm run start
- Choose options using numbers (1, 2, 3, 4, etc.)

## Setup

- mkdir text-battle-system
- git init
- npm init
  - default settings
- npm i typescript --save-dev
- npx tsc --init
- npm i --save-dev @types/node
- add node_modules and output file to .gitignore
- add build and run script to package.json