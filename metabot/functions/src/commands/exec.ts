import * as got from 'got'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import { BotExector } from 'metabot-bot'
import { exector } from '../utils/config'
import { firestore, auth } from '../utils/firebase'

export const command = 'exec <botNickname> [args..]'
export const desc = 'Exec a bot'

export async function handler({ args, context }) {
  const { botNickname } = args
  const invitedBot = await firestore.collection('invitedBot').where('nickname', '==', botNickname).limit(1).get()

  if (invitedBot.empty) {
    return {
      text: `${botNickname} isn't invited in this channel`
    }
  }

  const botPath = invitedBot.docs[0].get('botPath')
  const bot = await firestore.collection('bots').where('botPath', '==', botPath).limit(1).get()

  const sourceUrl = bot.docs[0].get('sourceUrl')
  const savedSourcePath = await fetchSourceFile(sourceUrl)

  const botExector: BotExector = require(savedSourcePath).bot
  const replyMessage = await botExector.execute({ message: context.message })

  return replyMessage
}

function createTempDir(): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.mkdtemp(path.join(os.tmpdir(), 'source'), (err, tmpDir) => {
      if (err) {
        reject(err)
        return
      }

      resolve(tmpDir)
    })
  })
}

function fetchSourceFile(url: string) {
  return new Promise<string>(async (resolve, reject) => {
    const tmpDir = await createTempDir()
    const sourcePath = path.join(tmpDir, 'index.js')
    got
      .stream(url)
      .pipe(fs.createWriteStream(sourcePath))
      .on('finish', () => resolve(sourcePath))
      .on('error', reject)
  })
}
