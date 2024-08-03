import { exit } from 'node:process'
import { Battle } from './battle'
import { CreateDefaultMageCharacter, CreateDefaultRogueCharacter } from './character'

async function main(){
  const battle = new Battle({
    player1: CreateDefaultMageCharacter(),
    player2: CreateDefaultRogueCharacter(),
  })
  await battle.startBattle()
  console.log("Result:", battle.battleStatus)
  exit()
}

main()