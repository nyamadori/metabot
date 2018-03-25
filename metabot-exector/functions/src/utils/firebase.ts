import * as firebase from 'firebase'
import apiKey from '../credentials/apiKey'
require("firebase/firestore")

firebase.initializeApp(apiKey)

export const firestore = firebase.firestore()
export const auth = firebase.auth()
