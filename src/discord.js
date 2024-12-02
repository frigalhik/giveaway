import { REST } from '@discordjs/rest'
import { env } from 'node:process'

const client = new REST().setToken(env.DISCORD_TOKEN)

export async function hasMember(guildId, memberId) {
  try {
    await client.get(`/guilds/${guildId}/members/${memberId}`)
    return true
  } catch (error) {
    switch (error.code) {
      // unknown user
      case 10013:
      // unknown member
      case 10007:
        return false
      default:
        throw error
    }
  }
}
