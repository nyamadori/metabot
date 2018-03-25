import Router from 'express-promise-router'
import { firestore, auth } from '../utils/firebase'

export const router = Router()

router.post('/', async (req, res) => {
  const session = req.body.session

  try {
    await auth.signInWithCustomToken(session)
  } catch (e) {
    if (e.code === 'auth/custom-token-mismatch' || e.code === 'auth/invalid-custom-token') {
      return res.send(403)
    }
  }

  const brainId = req.body.brainId

  try {
    const brain = await firestore.doc(`/brains/${brainId}`).get()

    // プログラムを実行
    console.log(brain.get('data'))
  } catch (e) {
    if (e.code === 'permission-denied' || e.code === 'not-found') {
      return res.status(404).send({ error: 'Not found brain' })
    } else {
      throw e
    }
  }

  return res.send({ message: { text: 'executed', type: 'in_channel' }})
})
