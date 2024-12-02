import { log, warn } from 'node:console'
import { randomInt } from 'node:crypto'
import { env } from 'node:process'
import { getGiveaway } from './db.js'
import { hasMember, sendMessage } from './discord.js'

async function main() {
  const { users, winners: numberOfWinners, guildId, channelId } = await getGiveaway(env.GIVEAWAY_ID)

  log(`Participants (${users.length})`, users)

  let winners = []

  for (let i = 0; i < numberOfWinners; i++) {
    if (users.length === 0) {
      break
    }

    const winnerId = users[randomInt(users.length)]
    users.splice(users.indexOf(winnerId), 1)

    if (!(await hasMember(guildId, winnerId))) {
      warn(`User ${winnerId} is not a member of the guild. Skipping...`)
      continue
    }

    winners.push(winnerId)
  }

  log(`Winners (${winners.length}/${numberOfWinners})`, winners)

  await sendMessage(
    channelId,
    winners.length ?
      `Победител${winners.length === 1 ? 'ь' : 'и'}: ${winners.map(id => `<@${id}>`).join(', ')}. Поздравляем!` :
      'В розыгрыше никто не победил. Мило.',
  )
}

await main()
