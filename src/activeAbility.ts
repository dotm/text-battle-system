import { CharacterBattleEffect } from "./types"

export const GlobalActiveAbilityDirectory = function(){
  let m = new Map<string, CharacterBattleEffect>()
  m.set("Warrior's Stun Lv.1", {
    name: "Warrior's Stun Lv.1",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "penetrationWhenDoingAttack",
    modifier: "+ 10",
  })
  m.set("Warrior's Immobilize Lv.1", {
    name: "Warrior's Immobilize Lv.1",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "fleeingChance",
    modifier: "- 0.7",
    affectedRoundsLeft: 3,
  })
  m.set("Warrior's Immobilize Lv.2", {
    name: "Warrior's Immobilize Lv.2",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "fleeingChance",
    modifier: "- 100",
    affectedRoundsLeft: 3,
  })
  m.set("Mage's Illusion Lv.1", {
    name: "Mage's Illusion Lv.1",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "critMultiplierWhenDoingAttack",
    modifier: "+ 1",
  })
  m.set("Mage's Poison Hex Lv.1", {
    name: "Mage's Poison Hex Lv.1",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "healthPoints",
    modifier: "- 10",
    affectedRoundsLeft: 3,
  })
  m.set("Mage's Poison Hex Lv.2", {
    name: "Mage's Poison Hex Lv.2",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "healthPoints",
    modifier: "- 20",
    affectedRoundsLeft: 3,
  })
  m.set("Rogue's Evade Lv.1", {
    name: "Rogue's Evade Lv.1",
    target: "self",
    source: "Active Ability",
    affectedStat: "armorWhenReceivingAttack",
    modifier: "+ 5",
  })
  m.set("Rogue's Armor Weaken Lv.1", {
    name: "Rogue's Armor Weaken Lv.1",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "armorWhenReceivingAttack",
    modifier: "- 15",
    affectedRoundsLeft: 3,
  })
  m.set("Rogue's Armor Weaken Lv.2", {
    name: "Rogue's Armor Weaken Lv.2",
    target: "enemy",
    source: "Active Ability",
    affectedStat: "armorWhenReceivingAttack",
    modifier: "- 15",
    affectedRoundsLeft: 6,
  })
  return m
}()