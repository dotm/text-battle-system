import { CharacterBattleEffect } from "./types"

export const GlobalPassiveAbilityDirectory = function(){
  let m = new Map<string, CharacterBattleEffect>()
  m.set("Rogue's Attack", {
    name: "Rogue's Attack",
    source: "Passive Ability",
    affectedStat: "penetrationWhenDoingAttack",
    modifier: "+ 10",
  })
  m.set("Mage's Crit", {
    name: "Mage's Crit",
    source: "Passive Ability",
    affectedStat: "critMultiplierWhenDoingAttack",
    modifier: "+ 1",
  })
  m.set("Warrior's Defense", {
    name: "Warrior's Defense",
    source: "Passive Ability",
    affectedStat: "armorWhenReceivingAttack",
    modifier: "+ 5",
  })
  return m
}()