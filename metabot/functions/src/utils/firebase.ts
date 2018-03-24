import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import serviceAccount from '../credentials/service-account'

admin.initializeApp({
  ...functions.config().firebase,
  credential: admin.credential.cert(serviceAccount)
})

export const firestore = admin.firestore()
export const auth = admin.auth()
