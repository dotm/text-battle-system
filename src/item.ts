import { CharacterBattleEffect } from "./types"

export const GlobalItemDirectory = function(){
  let m = new Map<string, CharacterBattleEffect>()
  m.set("Health Potion", {
    name: "Health Potion",
    target: "self",
    source: "Inventory",
    affectedStat: "healthPoints",
    modifier: "+ 100",
  })
  return m
}()