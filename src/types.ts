
//TODO: separate stat effect and effects like poison? ~kodok
//TODO: separate character, battle, global map to different files ~kodok
/*
~kodok
Implement ability and interaction between them.
Implement consumables and inventory.
Implement out of combat ability (just map with description and name).
Implement ability leveling.
implement NPCs.
remove any type.
relogin should load last state correctly (make sure serde is correct).
re-check requirements.
*/

export interface PlayerAction {
  type: "flee" | "attack" | "ability" | "use-item" | "do-nothing",
  abilityName?: undefined | string, //undefined if type is not "ability"
  itemName?: undefined | string, //undefined if type is not "ability"
}
export type PlayerActionOutcome = {
  outcomes: (ActionOutcomeFlees | ActionOutcomeNothing | ActionOutcomeUpdateStat | ActionOutcomeAddEffect | ActionOutcomeRemoveEffect)[]
}
export interface ActionOutcomeFlees {
  type: "flees",
}
export interface ActionOutcomeNothing {
  type: "nothing",
}
export interface ActionOutcomeUpdateStat {
  type: "update-stat",
  target: "self" | "enemy",
  affectedStat: string,
  modifier: string,
}
export interface ActionOutcomeAddEffect {
  type: "add-effect",
  target: "self" | "enemy",
  source: "Passive Ability" | "Active Ability" | "Inventory",
  name: string,
  affectedStat: string,
  modifier: string,
}
export interface ActionOutcomeRemoveEffect {
  type: "remove-effect",
  target: "self" | "enemy",
  source: "Passive Ability" | "Active Ability" | "Inventory",
  name: string,
  affectedStat: string,
  modifier: string,
}
export interface BattleRound {
  player1Action: PlayerAction,
  player2Action: PlayerAction,
  playerThatMoveFirst: "player1" | "player2",
  player1ActionOutcome: PlayerActionOutcome,
  player2ActionOutcome: PlayerActionOutcome,
}

export interface CharacterBattleEffect {
  source: "Passive Ability" | "Active Ability" | "Inventory",
  name: string,
  affectedStat: string,
  modifier: string,
}

export interface CharacterBaseState {
  passiveAbilityName: string,
  maxHealthPoints: number,
  inventory: any[],
  baseAttackDamage: number,
  penetrationWhenDoingAttack: number, //increase damage dealt
  armorWhenReceivingAttack: number, //decrease damage taken
  critChanceIncrementWhenDoingAttack: number, //0.0 - 1.0
  critMultiplierWhenDoingAttack: number,
  critChanceDecrementWhenReceivingAttack: number, //0.0 - 1.0
  critMultiplierWhenReceivingAttack: number,
}
export interface CharacterCurrentState {
  healthPoints: number,
  effectsApplied: CharacterBattleEffect[], //stunned, poisoned, buff, etc. create new Effect type ~kodok
  inventory: any,
  penetrationWhenDoingAttack: number, //increase damage dealt
  armorWhenReceivingAttack: number, //decrease damage taken
  critChanceIncrementWhenDoingAttack: number, //0.0 - 1.0
  critMultiplierWhenDoingAttack: number,
  critChanceDecrementWhenReceivingAttack: number, //0.0 - 1.0
  critMultiplierWhenReceivingAttack: number,
}
export type CharacterClass = "mage" | "rogue" | "warrior"
export type CharacterSerializedOutput = {
  characterName: string;
  characterClass: CharacterClass;
  baseState: CharacterBaseState;
  currentState: CharacterCurrentState;
}
