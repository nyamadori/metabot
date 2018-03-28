import { firestore, auth } from '../utils/firebase'
import * as got from 'got'
import { exector } from '../utils/config'

export const command = 'exec <botId> [args..]'
export const desc = 'Exec a bot'

export async function handler({ args, context }) {
  const { message } = context
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

  const brainId = brains.docs[0].id
  const uid = `__brain_operator_${brainId}__`

  try {
    await auth.getUser(uid)
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      await auth.createUser({ uid: uid })
    } else {
      throw (error)
    }
  }

  const sessionToken = await auth.createCustomToken(uid)

  const botResponse =
    await got.post(
      `${exector.api.endpoint}/api/requests`,
      {
        body: {
          session: sessionToken,
          brainId: brainId
        },
        json: true
      }
    )

  return botResponse.body.message
}
