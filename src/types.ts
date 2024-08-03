
/*
~kodok
Implement ability and interaction between them: Illusion, Stun, Stumble, Evade
remove type any.
re-check requirements.
*/

export interface PlayerAction {
  type: "flee" | "attack" | "ability" | "use-item" | "do-nothing",
  abilityName?: undefined | string, //undefined if type is not "ability"
  itemName?: undefined | string, //undefined if type is not "ability"
}
export type PlayerActionOutcome = {
  outcomes: (ActionOutcomeFlees | ActionOutcomeNothing | ActionOutcomeUpdateStat | ActionOutcomeUpdateEffect)[]
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
  source: "Attack" | "Passive Ability" | "Active Ability" | "Inventory",
  affectedStat?: string,
  modifier?: string,
  itemName?: string,
}
export interface ActionOutcomeUpdateEffect {
  type: "update-effect",
  target: "self" | "enemy",
  source: "Passive Ability" | "Active Ability" | "Inventory",
  name: string,
  affectedStat?: string,
  modifier?: string,
  otherEffect?: OtherEffect,
  affectedRoundsLeft?: number,
}
export interface BattleRound {
  player1Action: PlayerAction,
  player2Action: PlayerAction,
  playerThatMoveFirst: "player1" | "player2",
  player1ActionOutcome: PlayerActionOutcome,
  player2ActionOutcome: PlayerActionOutcome,
}

export type OtherEffect = "Poison"
export interface CharacterBattleEffect {
  source: "Passive Ability" | "Active Ability" | "Inventory",
  name: string,
  target: "self" | "enemy",
  affectedStat?: string,
  modifier?: string,
  otherEffect?: OtherEffect,
  affectedRoundsLeft?: number, // Undefined means permanent or one-off only.
}
export interface CharacterOutOfCombatAbility {
  source: "Out of Combat Ability",
  name: string,
  description: string,
}
export type InventoryEntry = {[key: string]: number}
export interface CharacterBaseState {
  passiveAbilityName: string,
  activeAbilityNames: string[],
  outOfCombatAbilityName: string,
  maxHealthPoints: number,
  inventory: InventoryEntry, //map of {itemName: quantity}
  baseAttackDamage: number,
  penetrationWhenDoingAttack: number, //increase damage dealt
  armorWhenReceivingAttack: number, //decrease damage taken
  critChanceIncrementWhenDoingAttack: number, //0.0 - 1.0
  critMultiplierWhenDoingAttack: number,
  critChanceDecrementWhenReceivingAttack: number, //0.0 - 1.0
  critMultiplierWhenReceivingAttack: number,
  fleeingChance: number, //0.0 - 1.0
}
export interface CharacterCurrentState {
  healthPoints: number,
  effectsApplied: CharacterBattleEffect[], //stunned, poisoned, buff, etc. create new Effect type ~kodok
  inventory: InventoryEntry, //map of {itemName: quantity}
  penetrationWhenDoingAttack: number, //increase damage dealt
  armorWhenReceivingAttack: number, //decrease damage taken
  critChanceIncrementWhenDoingAttack: number, //0.0 - 1.0
  critMultiplierWhenDoingAttack: number,
  critChanceDecrementWhenReceivingAttack: number, //0.0 - 1.0
  critMultiplierWhenReceivingAttack: number,
  fleeingChance: number, //0.0 - 1.0
}
export type CharacterSerializedOutput = {
  isNPC: boolean,
  characterName: string;
  characterClass: string;
  baseState: CharacterBaseState;
  currentState: CharacterCurrentState;
}
