import { log, warn } from 'node:console'
import { randomInt } from 'node:crypto'
import { env } from 'node:process'
import { getGiveaway } from './db.js'
import { hasMember } from './discord.js'

async function main() {
  const { users, winners: numberOfWinners, guildId } = await getGiveaway(env.GIVEAWAY_ID)

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
}

await main()
