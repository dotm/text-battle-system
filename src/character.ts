import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
const rl = createInterface({ input: stdin, output: stdout })

import { GlobalPassiveAbilityDirectory } from "./passiveAbility";
import { CharacterBaseState, CharacterClass, CharacterCurrentState, CharacterSerializedOutput, PlayerAction } from "./types";

export class Character {
  characterName: string;
  characterClass: CharacterClass;
  baseState: CharacterBaseState;
  currentState: CharacterCurrentState;
  
  constructor({
    characterName,
    characterClass,
    baseState,
    currentState = undefined,
  }: {
    characterName: string,
    characterClass: CharacterClass,
    baseState: CharacterBaseState;
    currentState?: CharacterCurrentState;
  }){
    this.characterName = characterName
    this.characterClass = characterClass
    this.baseState = baseState
    
    //initialize
    if (currentState !== undefined) {
      this.currentState = currentState
    } else {
      let initialState: CharacterCurrentState = {
        healthPoints: baseState.maxHealthPoints,
        effectsApplied: [],
        inventory: baseState.inventory,
        penetrationWhenDoingAttack: baseState.penetrationWhenDoingAttack,
        armorWhenReceivingAttack: baseState.armorWhenReceivingAttack,
        critChanceIncrementWhenDoingAttack: baseState.critChanceIncrementWhenDoingAttack,
        critMultiplierWhenDoingAttack: baseState.critMultiplierWhenDoingAttack,
        critChanceDecrementWhenReceivingAttack: baseState.critChanceDecrementWhenReceivingAttack,
        critMultiplierWhenReceivingAttack: baseState.critMultiplierWhenReceivingAttack,
        fleeingChance: baseState.fleeingChance,
      }
      const passiveAbility = GlobalPassiveAbilityDirectory.get(baseState.passiveAbilityName)
      if (passiveAbility && passiveAbility.target === "self") {
        //TODO: implement passive ability that affects enemy
        initialState.effectsApplied.push(passiveAbility)
      }
      this.currentState = initialState
    }
  }

  //action in combat
  async takeAction(): Promise<PlayerAction> {
    const decisionStr = await rl.question(
      `(${this.characterName}) Please choose between: Attack (1), Ability (2), Flee (3), Use Item (4)\n`
    )
    switch (decisionStr) {
      case "1":
        return { type: "attack" }
      case "2":
        const abilityStr = await rl.question(
          `(${this.characterName}) Please choose ability: ${this.baseState.activeAbilityNames.map((s,i)=>`${s} (${i+1})`).join(", ")}\n`
        )
        return {
          type: "ability",
          abilityName: this.baseState.activeAbilityNames[parseInt(abilityStr)-1] ?? undefined,
        }
      case "3":
        return { type: "flee" }
        //other case here ~kodok
      default:
        return  { type: "do-nothing" }
    }
  }

  //system methods
  serialize(): string {
    let obj: CharacterSerializedOutput = {
      characterName: this.characterName,
      characterClass: this.characterClass,
      baseState: this.baseState,
      currentState: this.currentState,
    }
    return JSON.stringify(obj, null, 2)
  }
  static deserialize(obj: CharacterSerializedOutput) {
    return new Character(obj)
  }
  // updateEffectState: any,
}

export function CreateDefaultWarriorCharacter(){
  return new Character({
    characterName: "Generic Warrior",
    characterClass: "warrior",
    baseState: {
      passiveAbilityName: "Warrior's Defense",
      activeAbilityNames: ["Warrior's Stun", "Warrior's Immobilize"], //can only specify one active ability for non-NPC character
      outOfCombatAbilityName: "Warrior's Instinct",
      maxHealthPoints: 150,
      inventory: [],
      baseAttackDamage: 10,
      penetrationWhenDoingAttack: 0,
      armorWhenReceivingAttack: 0,
      critChanceIncrementWhenDoingAttack: 0.2,
      critMultiplierWhenDoingAttack: 2,
      critChanceDecrementWhenReceivingAttack: 0,
      critMultiplierWhenReceivingAttack: 0.5,
      fleeingChance: 1,
    },
  })
}
export function CreateDefaultMageCharacter(){
  return new Character({
    characterName: "Generic Mage",
    characterClass: "mage",
    baseState: {
      passiveAbilityName: "Mage's Crit",
      activeAbilityNames: ["Mage's Illusion", "Mage's Poison Hex"], //can only specify one active ability for non-NPC character
      outOfCombatAbilityName: "Mage's Barrier",
      maxHealthPoints: 100,
      inventory: [],
      baseAttackDamage: 20,
      penetrationWhenDoingAttack: 0,
      armorWhenReceivingAttack: 0,
      critChanceIncrementWhenDoingAttack: 0.5,
      critMultiplierWhenDoingAttack: 2,
      critChanceDecrementWhenReceivingAttack: 0,
      critMultiplierWhenReceivingAttack: 1,
      fleeingChance: 1,
    },
  })
}
export function CreateDefaultRogueCharacter(){
  return new Character({
    characterName: "Generic Rogue",
    characterClass: "rogue",
    baseState: {
      passiveAbilityName: "Rogue's Attack",
      activeAbilityNames: ["Rogue's Evade", "Rogue's Armor Weaken"], //can only specify one active ability for non-NPC character
      outOfCombatAbilityName: "Rogue's Steal Item",
      maxHealthPoints: 100,
      inventory: [],
      baseAttackDamage: 20,
      penetrationWhenDoingAttack: 0,
      armorWhenReceivingAttack: 0,
      critChanceIncrementWhenDoingAttack: 0.2,
      critMultiplierWhenDoingAttack: 2,
      critChanceDecrementWhenReceivingAttack: 0,
      critMultiplierWhenReceivingAttack: 1,
      fleeingChance: 1,
    },
  })
}
