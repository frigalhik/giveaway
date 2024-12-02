import { env } from 'node:process'
import { App, Credentials } from 'realm-web'

function getClient() {
  const app = new App(env.MONGO_APP_ID)
  return app.logIn(Credentials.apiKey(env.MONGO_APP_KEY))
}

async function getCollection() {
  const client = await getClient()
  return client.mongoClient('mongodb-atlas').db(env.MONGO_DB).collection('Giveaway')
}

export async function getGiveaway(id) {
  const collection = await getCollection()
  return collection.findOne({ _id: id })
}
