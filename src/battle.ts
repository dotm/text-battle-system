import { Character } from "./character";
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

  generateRoundOutcomes({
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
    }
    //apply stats and effects update from player 1 action
    for (let i = 0; i < player1ActionOutcome.outcomes.length; i++) {
      const outcome = player1ActionOutcome.outcomes[i];
      if (outcome.type === 'update-stat'){
        const updateStatOutcome = outcome as ActionOutcomeUpdateStat
        if (updateStatOutcome.target === "enemy" && updateStatOutcome.affectedStat === "healthPoints") {
          this.player2.currentState.healthPoints = eval(`${this.player2.currentState.healthPoints} ${updateStatOutcome.modifier}`)
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
    }
    //apply stats and effects update from player 2 action
    for (let i = 0; i < player2ActionOutcome.outcomes.length; i++) {
      const outcome = player2ActionOutcome.outcomes[i];
      if (outcome.type === 'update-stat'){
        const updateStatOutcome = outcome as ActionOutcomeUpdateStat
        if (updateStatOutcome.target === "enemy" && updateStatOutcome.affectedStat === "healthPoints") {
          this.player1.currentState.healthPoints = eval(`${this.player1.currentState.healthPoints} ${updateStatOutcome.modifier}`)
        }
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
      } = this.generateRoundOutcomes({player1Action, player2Action})
      //generate outcome for player 2

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
  
  calculateFleeOutcome(fleeingPlayer: "player1" | "player2"): "flees" | "nothing" {
    return "flees" //calculate failed fleeing later ~kodok
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
    //make function for all the reduce below ~kodok
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
      affectedStat: "healthPoints",
      modifier: `- ${damageDealt}`,
    }
  }
}