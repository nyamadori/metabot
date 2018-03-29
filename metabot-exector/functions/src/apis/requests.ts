import Router from 'express-promise-router'
import * as got from 'got'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { BotExector } from 'metabot-bot'

import { firestore, auth } from '../utils/firebase'

export const router = Router()

router.post('/', async (req, res) => {
  const { sessionToken, brainId, bot, command, context } = req.body

  console.log(req.body)

  try {
    await auth.signInWithCustomToken(sessionToken)
  } catch (e) {
    if (e.code === 'auth/custom-token-mismatch' || e.code === 'auth/invalid-custom-token') {
      return res.send(403)
    }
  }

  let replyMessage

  try {
    const brainRef = await firestore.doc(`/brains/${brainId}`).get
    const savedSourcePath = await fetchSourceFile(bot.sourceUrl)
    const botExector: BotExector = require(savedSourcePath).bot

    console.log('Executing bot with: ', command)

    context['brainRef'] = brainRef
    replyMessage = await botExector.execute(command, context)
  } catch (e) {
    if (e.code === 'permission-denied' || e.code === 'not-found') {
      return res.status(404).send({ error: 'Not found brain' })
    } else {
      throw e
    }
  }

  return res.send({ message: replyMessage })
})


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
