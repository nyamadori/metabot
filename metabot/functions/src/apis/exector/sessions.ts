import Router from 'express-promise-router'
import { firestore, auth } from '../../utils/firebase'

export const router = Router()

router.post('/', async (req, res) => {
  const { brainToken } = req.body

  const brain =
    await firestore
      .collection('brains')
      .where('token', '==', brainToken)
      .limit(1)
      .get()

  if (brain.empty) {
    return res.send(403)
  }

  const brainId = brain.docs[0].id

  const uid = `__brain_operator_${brainId}__`

  try {
    await auth.getUser(uid)
  } catch(error) {
    if (error.code === 'auth/user-not-found') {
      await auth.createUser({ uid: uid })
    } else {
      return res.send(500)
    }
  }

  const sessionToken = await auth.createCustomToken(uid)

  return res.send({ uid, sessionToken })
})
