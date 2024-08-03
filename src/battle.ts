import { GlobalActiveAbilityDirectory } from "./activeAbility";
import { Character } from "./character";
import { GlobalItemDirectory } from "./item";
import { ActionOutcomeUpdateStat, BattleRound, PlayerAction, PlayerActionOutcome } from "./types";

export class Battle {
  player1: Character;
  player2: Character;
  roundHistory: BattleRound[];
  player1InitialData: string;
  player2InitialData: string;
  lastState: {
    player1State: string,
    player2State: string,
    battleEnded: boolean,
    battleStatus: string,
  };
  battleEnded: boolean = false;
  battleStatus: string = "starting";

  constructor({
    player1,
    player2,
  }: {
    player1: Character,
    player2: Character,
  }){
    this.player1 = player1
    this.player2 = player2
    
    //initialize
    this.roundHistory = []
    this.player1InitialData = player1.serialize()
    this.player2InitialData = player1.serialize()
    this.lastState = {
      player1State: this.player1InitialData,
      player2State: this.player2InitialData,
      battleEnded: this.battleEnded,
      battleStatus: this.battleStatus,
    }
  }

  generateRoundOutcomesAndSideEffects({
    player1Action,
    player2Action,
  }: {
    player1Action: PlayerAction,
    player2Action: PlayerAction,
  }) : {
    player1ActionOutcome: PlayerActionOutcome,
    player2ActionOutcome: PlayerActionOutcome,
    player1Flees: boolean,
    player2Flees: boolean,
  } {
    let player1ActionOutcome: PlayerActionOutcome = { outcomes: [{type: "nothing"}] };
    let player2ActionOutcome: PlayerActionOutcome = { outcomes: [{type: "nothing"}] };
    //generate outcome for player 1
    let player1Flees = false
    if (player1Action.type === "attack") {
      player1ActionOutcome = { outcomes: [this.calculateAttackDamageOutcome("player1")] }
    } else if (player1Action.type === "flee") {
      const outcome = this.calculateFleeOutcome("player1")
      player1ActionOutcome = { outcomes: [{type: outcome}] }
      player1Flees = outcome === "flees"
    } else if (player1Action.type === "ability") {
      const activeAbility = GlobalActiveAbilityDirectory.get(player1Action.abilityName ?? "")
      if (activeAbility?.target === "self"){
        this.player1.currentState.effectsApplied.push(activeAbility)
      } else if (activeAbility?.target === "enemy") {
        this.player2.currentState.effectsApplied.push(activeAbility)
      } else {
        //do nothing
      }
      if (activeAbility?.target) {
        player1ActionOutcome = { outcomes: [
          {
            type: "update-effect",
            ...activeAbility
          }
        ] }
      }
    } else if (player1Action.type === "use-item") {
      const itemUsed = GlobalItemDirectory.get(player1Action.itemName ?? "")
      if (itemUsed?.target === "self"){
        this.player1.currentState.effectsApplied.push(itemUsed)
      } else if (itemUsed?.target === "enemy") {
        this.player2.currentState.effectsApplied.push(itemUsed)
      } else {
        //do nothing
      }
      if (itemUsed?.target) {
        player1ActionOutcome = { outcomes: [
          {
            type: "update-stat",
            itemName: itemUsed.name,
            ...itemUsed
          }
        ] }
      }
    }
    //apply stats update from player 1 action
    for (let i = 0; i < player1ActionOutcome.outcomes.length; i++) {
      const outcome = player1ActionOutcome.outcomes[i];
      if (outcome.type === 'update-stat'){
        const updateStatOutcome = outcome as ActionOutcomeUpdateStat
        if (updateStatOutcome.target === "self" && updateStatOutcome.affectedStat === "healthPoints") {
          const newHealthPoint = eval(`${this.player1.currentState.healthPoints} ${updateStatOutcome.modifier}`)
          this.player1.currentState.healthPoints = Math.min(newHealthPoint, this.player1.baseState.maxHealthPoints)
        }else if (updateStatOutcome.target === "enemy" && updateStatOutcome.affectedStat === "healthPoints") {
          this.player2.currentState.healthPoints = eval(`${this.player2.currentState.healthPoints} ${updateStatOutcome.modifier}`)
        }
        if (updateStatOutcome.source === "Inventory" && updateStatOutcome.itemName) {
          this.player1.currentState.inventory[updateStatOutcome.itemName] -= 1
          if (this.player1.currentState.inventory[updateStatOutcome.itemName] <= 0) {
            delete this.player1.currentState.inventory[updateStatOutcome.itemName]
          }
        }
      }
    }

    //generate outcome for player 2
    let player2Flees = false
    if (player1Flees || this.player1.currentState.healthPoints <= 0) {
      player2ActionOutcome = { outcomes: [{type: "nothing"}] }
    } else if (player2Action.type === "attack") {
      player2ActionOutcome = { outcomes: [this.calculateAttackDamageOutcome("player2")] }
    } else if (player2Action.type === "flee") {
      const outcome = this.calculateFleeOutcome("player2")
      player2ActionOutcome = { outcomes: [{type: outcome}] }
      player2Flees = outcome === "flees"
    } else if (player2Action.type === "ability") {
      const activeAbility = GlobalActiveAbilityDirectory.get(player2Action.abilityName ?? "")
      if (activeAbility?.target === "self"){
        this.player2.currentState.effectsApplied.push(activeAbility)
      } else if (activeAbility?.target === "enemy") {
        this.player1.currentState.effectsApplied.push(activeAbility)
      } else {
        //do nothing
      }
      if (activeAbility?.target) {
        player2ActionOutcome = { outcomes: [
          {
            type: "update-effect",
            ...activeAbility
          }
        ] }
      }
    } else if (player2Action.type === "use-item") {
      const itemUsed = GlobalItemDirectory.get(player2Action.itemName ?? "")
      if (itemUsed?.target === "self"){
        this.player2.currentState.effectsApplied.push(itemUsed)
      } else if (itemUsed?.target === "enemy") {
        this.player1.currentState.effectsApplied.push(itemUsed)
      } else {
        //do nothing
      }
      if (itemUsed?.target) {
        player2ActionOutcome = { outcomes: [
          {
            type: "update-stat",
            itemName: itemUsed.name,
            ...itemUsed
          }
        ] }
      }
    }
    //apply stats update from player 2 action
    for (let i = 0; i < player2ActionOutcome.outcomes.length; i++) {
      const outcome = player2ActionOutcome.outcomes[i];
      if (outcome.type === 'update-stat'){
        const updateStatOutcome = outcome as ActionOutcomeUpdateStat
        if (updateStatOutcome.target === "self" && updateStatOutcome.affectedStat === "healthPoints") {
          const newHealthPoint = eval(`${this.player2.currentState.healthPoints} ${updateStatOutcome.modifier}`)
          this.player2.currentState.healthPoints = Math.min(newHealthPoint, this.player2.baseState.maxHealthPoints)
        }else if (updateStatOutcome.target === "enemy" && updateStatOutcome.affectedStat === "healthPoints") {
          this.player1.currentState.healthPoints = eval(`${this.player1.currentState.healthPoints} ${updateStatOutcome.modifier}`)
        }
        if (updateStatOutcome.source === "Inventory" && updateStatOutcome.itemName) {
          this.player2.currentState.inventory[updateStatOutcome.itemName] -= 1
          if (this.player2.currentState.inventory[updateStatOutcome.itemName] <= 0) {
            delete this.player2.currentState.inventory[updateStatOutcome.itemName]
          }
        }
      }
    }

    //apply effects update from player 1 and 2 action
    for (let i = 0; i < this.player1.currentState.effectsApplied.length; i++) {
      const effect = this.player1.currentState.effectsApplied[i];
      if (effect.affectedRoundsLeft) {
        if (effect.affectedStat === "healthPoints") {
          this.player1.currentState.healthPoints = eval(`${this.player1.currentState.healthPoints} ${effect.modifier}`)
        }
        this.player1.currentState.effectsApplied[i].affectedRoundsLeft! -= 1
      }
      if (effect.affectedRoundsLeft === 0) {
        this.player1.currentState.effectsApplied.splice(i, 1)
      }
    }
    for (let i = 0; i < this.player2.currentState.effectsApplied.length; i++) {
      const effect = this.player2.currentState.effectsApplied[i];
      if (effect.affectedRoundsLeft) {
        if (effect.affectedStat === "healthPoints") {
          this.player2.currentState.healthPoints = eval(`${this.player2.currentState.healthPoints} ${effect.modifier}`)
        }
        this.player2.currentState.effectsApplied[i].affectedRoundsLeft! -= 1
      }
      if (effect.affectedRoundsLeft === 0) {
        this.player2.currentState.effectsApplied.splice(i, 1)
      }
    }

    return {
      player1ActionOutcome,
      player2ActionOutcome,
      player1Flees,
      player2Flees
    }
  }

  async startBattle(): Promise<void> {
    this.battleStatus = "In progress"
    while(!this.battleEnded){
      //takeUserActions
      const player1Action = await this.player1.takeAction()
      const player2Action = await this.player2.takeAction()
      //calculateOutcomes
      // for now we'll hardcode so that player 1 always move first
      // later on we can make it more dynamic
      const {
        player1ActionOutcome,
        player2ActionOutcome,
        player1Flees,
        player2Flees,
      } = this.generateRoundOutcomesAndSideEffects({player1Action, player2Action})

      //saveOutcome
      const battleRoundData: BattleRound = {
        player1Action: player1Action,
        player2Action: player2Action,
        playerThatMoveFirst: "player1",
        player1ActionOutcome: player1ActionOutcome,
        player2ActionOutcome: player2ActionOutcome,
      }
      console.log("Battle Round:", JSON.stringify({
        ...battleRoundData,
        ...{
          player1HealthPoints: this.player1.currentState.healthPoints,
          player2HealthPoints: this.player2.currentState.healthPoints,
        }},
        null, 2,
      ))
      this.roundHistory.push(battleRoundData)

      const healthPointsOfPlayer1 = this.player1.currentState.healthPoints
      const healthPointsOfPlayer2 = this.player2.currentState.healthPoints
      if (player1Flees) {
        this.battleEnded = true
        this.battleStatus = "Player 1 Fleed"
      }else if (player2Flees) {
        this.battleEnded = true
        this.battleStatus = "Player 2 Fleed"
      }else if (healthPointsOfPlayer1 <= 0 && healthPointsOfPlayer2 <= 0) {
        this.battleEnded = true
        this.battleStatus = "Tie"
      } else if (healthPointsOfPlayer1 <= 0){
        this.battleEnded = true
        this.battleStatus = "Player 2 wins"
      } else if (healthPointsOfPlayer2 <= 0){
        this.battleEnded = true
        this.battleStatus = "Player 1 wins"
      }

      this.lastState = {
        player1State: this.player1InitialData,
        player2State: this.player2InitialData,
        battleEnded: this.battleEnded,
        battleStatus: this.battleStatus,
      }
    }
  }
  
  calculateFleeOutcome(fleeingPlayerStr: "player1" | "player2"): "flees" | "nothing" {
    const fleeingPlayer = fleeingPlayerStr === "player1" ? this.player1 : this.player2
    const fleeingChance = fleeingPlayer.currentState.effectsApplied.reduce((acc, cur) => {
      if (cur.affectedStat !== "fleeingChance"){
        return acc
      }
      return eval(`${acc} ${cur.modifier}`)
    }, fleeingPlayer.currentState.fleeingChance)
    const flees = Math.random() < fleeingChance
    return flees ? "flees" : "nothing"
  }

  calculateAttackDamageOutcome(attackerPlayer: "player1" | "player2"): ActionOutcomeUpdateStat {
    let attacker: Character;
    let defender: Character;
    if (attackerPlayer === "player1"){
      attacker = this.player1
      defender = this.player2
    } else {
      attacker = this.player2
      defender = this.player1
    }
    //calculate damage dealt before crit
    const attackerPenetration = attacker.currentState.effectsApplied.reduce((acc, cur) => {
      if (cur.affectedStat !== "penetrationWhenDoingAttack"){
        return acc
      }
      return eval(`${acc} ${cur.modifier}`)
    }, attacker.currentState.penetrationWhenDoingAttack)
    const defenderArmor = defender.currentState.effectsApplied.reduce((acc, cur) => {
      if (cur.affectedStat !== "armorWhenReceivingAttack"){
        return acc
      }
      return eval(`${acc} ${cur.modifier}`)
    }, defender.currentState.armorWhenReceivingAttack)
    let damageDealt = attacker.baseState.baseAttackDamage + attackerPenetration - defenderArmor

    //calculate damage dealt with crit
    const attackerCritChance = attacker.currentState.effectsApplied.reduce((acc, cur) => {
      if (cur.affectedStat !== "critChanceIncrementWhenDoingAttack"){
        return acc
      }
      return eval(`${acc} ${cur.modifier}`)
    }, attacker.currentState.critChanceIncrementWhenDoingAttack)
    const defenderCritChance = defender.currentState.effectsApplied.reduce((acc, cur) => {
      if (cur.affectedStat !== "critChanceDecrementWhenReceivingAttack"){
        return acc
      }
      return eval(`${acc} ${cur.modifier}`)
    }, defender.currentState.critChanceDecrementWhenReceivingAttack)
    const critChance = attackerCritChance - defenderCritChance
    const critTriggered = Math.random() < critChance
    if (critTriggered) {
      let attackerCritMultiplier = attacker.currentState.effectsApplied.reduce((acc, cur) => {
        if (cur.affectedStat !== "critMultiplierWhenDoingAttack"){
          return acc
        }
        return eval(`${acc} ${cur.modifier}`)
      }, attacker.currentState.critMultiplierWhenDoingAttack)
      attackerCritMultiplier = Math.max(attackerCritMultiplier, 2) //can't be less than 2
      let defenderCritMultiplier = defender.currentState.effectsApplied.reduce((acc, cur) => {
        if (cur.affectedStat !== "critMultiplierWhenReceivingAttack"){
          return acc
        }
        return eval(`${acc} ${cur.modifier}`)
      }, defender.currentState.critMultiplierWhenReceivingAttack)
      defenderCritMultiplier = Math.max(defenderCritMultiplier, 0.5) //can't be less than 0.5
      damageDealt = (damageDealt * attackerCritMultiplier) * defenderCritMultiplier
    }
    return {
      type: "update-stat",
      target: "enemy",
      source: "Attack",
      affectedStat: "healthPoints",
      modifier: `- ${damageDealt}`,
    }
  }
}