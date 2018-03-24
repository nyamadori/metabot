import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

export const firestore = admin.firestore()
export const auth = admin.auth()
