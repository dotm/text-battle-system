import { CharacterBattleEffect } from "./types"

export const GlobalActiveAbilityDirectory = function(){
  let m = new Map<string, CharacterBattleEffect>()
  m.set("Warrior's Stun", {
    name: "Warrior's Stun",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "penetrationWhenDoingAttack",
    modifier: "+ 10",
  })
  m.set("Warrior's Immobilize", {
    name: "Warrior's Immobilize",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "fleeingChance",
    modifier: "- 100",
    affectedRoundsLeft: 3,
  })
  m.set("Mage's Illusion", {
    name: "Mage's Illusion",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "critMultiplierWhenDoingAttack",
    modifier: "+ 1",
  })
  m.set("Mage's Poison Hex", {
    name: "Mage's Poison Hex",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "healthPoints",
    modifier: "- 10",
    affectedRoundsLeft: 3,
  })
  m.set("Rogue's Evade", {
    name: "Rogue's Evade",
    target: "self",
    source: "Active Ability",
    affectedStat: "armorWhenReceivingAttack",
    modifier: "+ 5",
  })
  m.set("Rogue's Armor Weaken", {
    name: "Rogue's Armor Weaken",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "armorWhenReceivingAttack",
    modifier: "- 35",
    affectedRoundsLeft: 3,
  })
  return m
}()