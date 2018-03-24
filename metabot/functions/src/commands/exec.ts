import * as functions from 'firebase-functions'
import { firestore } from '../utils/firebase'

export const command = 'exec <botId> [args..]'
export const desc = 'Exec a bot'

export async function execute({ args, message }) {
  const scopesSnapshot =
    await firestore
      .collection('scopes')
      .where(`channels.${message.channel_id}`, '==', true)
      .where(`users.${message.user_id}`, '==', true)
      .limit(1)
      .get()

  if (scopesSnapshot.size === 0) {
    return {
      text: `Not found scope of: channel=${message.channel_name}, user=${message.user_name}`
    }
  }

  const scopeId = scopesSnapshot.docs[0].id

  const brains =
    await firestore
      .collection('brains')
      .where('botId', '==', args.botId)
      .where('scopeId', '==', scopeId)
      .limit(1)
      .get()

  if (brains.size === 0) {
    return {
      text: `Not found bot: ${args.botId}`
    }
  }

  console.log(brains.docs[0].data())

  return {
    response_type: "in_channel",
    text: `Exec`,
  }
}
