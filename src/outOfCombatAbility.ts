import { CharacterBattleEffect, CharacterOutOfCombatAbility } from "./types"

export const GlobalOutOfCombatAbilityDirectory = function(){
  let m = new Map<string, CharacterOutOfCombatAbility>()
  m.set("Warrior's Instinct", {
    name: "Warrior's Instinct",
    source: "Out of Combat Ability",
    description: "Able to detect nearby hostile characters even in hiding.",
  })
  m.set("Mage's Barrier", {
    name: "Mage's Barrier",
    source: "Out of Combat Ability",
    description: "Deflect enemies' out of combat abilities for a few hours.",
  })
  m.set("Rogue's Steal Item", {
    name: "Rogue's Steal Item",
    source: "Out of Combat Ability",
    description: "Randomly steal one item from other characters inventory. Can be cast 3 times per day.",
  })
  return m
}()