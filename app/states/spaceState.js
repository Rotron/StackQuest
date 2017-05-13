import { collisionArrayStatus, GamePlayers, GameEnemies, socket } from '../sockets'
import loadMaps from './utils/loadMaps'
import createMap from './utils/createMap'
import makeCollisionMap from './utils/makeCollisionMap'
import createPlayer from './utils/createPlayer'
import enemyCollision from './utils/enemyCollision'
import mapTransition from './utils/mapTransition'
import itemCollision from './utils/itemCollision'
import playerClass from '../classes/Player'
import Loot from '../classes/Loot'

/* global StackQuest, Phaser */

let map
  , playerObject
  , player
  , projectile
  , graveyard = []
  , itemGraveyard = []

// TODO get rid of this (put in sockets) ?
const localState = {
  loot: []
}

const spaceState = {
  init(character) {
    if (character) player = character
  },

  preload() {
    loadMaps.space()
  },

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE)

    map = createMap.space()

    socket.emit('setupState', player, 'spaceState')

    playerObject = createPlayer(player)
    projectile = playerObject.getProjectile()

    if (!collisionArrayStatus) {
      makeCollisionMap(map)
    }

    this.spawnLoot()

    this.physics.setBoundsToWorld(true, true, true, true, false)

    StackQuest.game.input.onDown.add(() => playerObject.attack())
  },

  update() {
    StackQuest.game.physics.arcade.collide(playerObject, StackQuest.game.layers.collisions)
    StackQuest.game.physics.arcade.collide(playerObject, StackQuest.game.layers.collisions_2)

    graveyard.forEach(enemy => {
      enemy.destroy()
      socket.emit('killEnemy', enemy.name)
    })
    graveyard = []

    itemGraveyard.forEach(item => {
      item.destroy()
      console.log('item killed ', item.name)
      socket.emit('killItem', item.name)
    })
    itemGraveyard = []

    // spawn loot
    // if (Math.random() * 1000 <= 1) this.spawnLoot()

    playerObject.movePlayer()
    itemCollision(playerObject, projectile, itemGraveyard)
    enemyCollision(playerObject, projectile, graveyard)
    mapTransition(player, playerObject, 'fantasyState')
  }
}

export default spaceState
