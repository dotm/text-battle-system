import { exit } from 'node:process'
import { Battle } from './battle'
import { CreateDefaultMageCharacter, CreateDefaultRogueCharacter, CreateDefaultWarriorCharacter } from './character'

async function main(){
  const battle = new Battle({
    player1: CreateDefaultRogueCharacter(),
    player2: CreateDefaultWarriorCharacter(),
  })
  await battle.startBattle()
  console.log("Result:", battle.battleStatus)
  exit()
}

main()