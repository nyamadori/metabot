import { firestore } from '../utils/firebase'

export const command = 'invite <botPath> <nickname>'
export const desc = 'Invite a bot'

export async function handler({ args, context }) {
  const { botPath, nickname } = args
  const { message } = context

  const invitedBot = await firestore.collection('invitedBots').where('nickname', '==', nickname).get()
  if (!invitedBot.empty) {
    return {
      response_type: "in_channel",
      text: `Already invited bot in this channel`,
    }
  }

  await
    firestore.collection('invitedBots').add({
      nickname, botPath, channelId: message.channel_id, invitedUserId: message.user_id
    })

  return {
    response_type: "in_channel",
    text: `Invited ${botPath} as ${nickname}`,
  }
}
