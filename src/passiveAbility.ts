import { CharacterBattleEffect } from "./types"

export const GlobalPassiveAbilityDirectory = function(){
  let m = new Map<string, CharacterBattleEffect>()
  m.set("Rogue's Attack Lv.1", {
    name: "Rogue's Attack Lv.1",
    target: "self",
    source: "Passive Ability",
    affectedStat: "penetrationWhenDoingAttack",
    modifier: "+ 10",
  })
  m.set("Rogue's Attack Lv.2", {
    name: "Rogue's Attack Lv.2",
    target: "self",
    source: "Passive Ability",
    affectedStat: "penetrationWhenDoingAttack",
    modifier: "+ 20",
  })
  m.set("Mage's Crit Lv.1", {
    name: "Mage's Crit Lv.1",
    target: "self",
    source: "Passive Ability",
    affectedStat: "critMultiplierWhenDoingAttack",
    modifier: "+ 1",
  })
  m.set("Mage's Crit Lv.2", {
    name: "Mage's Crit Lv.2",
    target: "self",
    source: "Passive Ability",
    affectedStat: "critMultiplierWhenDoingAttack",
    modifier: "+ 1.5",
  })
  m.set("Warrior's Defense Lv.1", {
    name: "Warrior's Defense Lv.1",
    target: "self",
    source: "Passive Ability",
    affectedStat: "armorWhenReceivingAttack",
    modifier: "+ 5",
  })
  m.set("Warrior's Defense Lv.2", {
    name: "Warrior's Defense Lv.2",
    target: "self",
    source: "Passive Ability",
    affectedStat: "armorWhenReceivingAttack",
    modifier: "+ 10",
  })
  return m
}()
