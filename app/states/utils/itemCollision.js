import { socket } from 'APP/app/sockets'

/* global StackQuest */

const itemCollision = (playerObject, items) => {
  for (const itemKey in items) {
    const item = items[itemKey]
    StackQuest.game.physics.arcade.collide(playerObject, item, (player, item) => {
      if (item.type === 'loot') {
        playerObject.lootCount++
        const lootCount = StackQuest.game.add.text(player.x, player.y + 20, 'Loot acquired ' + playerObject.lootCount, { font: '22px Times New Roman', fill: '#ffffff' })
        setTimeout(() => { lootCount.destroy() }, 3000)
      } else if (item.type === 'weapon') {
        const weaponNotice = StackQuest.game.add.text(player.x, player.y + 20, 'Weapon acquired, 2X Damage! ', { font: '22px Times New Roman', fill: '#ffffff' })
        // for now, doubling our projectile damage
        playerObject.getProjectile().damage *= 2
        setTimeout(() => { weaponNotice.destroy() }, 3000)
      } else {
        const armorNotice = StackQuest.game.add.text(player.x, player.y + 20, 'Armor acquired, 2X Health! ', { font: '22px Times New Roman', fill: '#ffffff' })
        // for now, double's the player's internal HP stat
        playerObject.stats.hp *= 2
        setTimeout(() => { armorNotice.destroy() }, 3000)
      }
      item.destroy()
      socket.emit('updatePlayer', { playerPos: playerObject.position, lootCount: playerObject.lootCount })
    })
  }
}

export default itemCollision