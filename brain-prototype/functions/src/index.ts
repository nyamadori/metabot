import * as firebase from "firebase"
require("firebase/firestore")

import * as functions from 'firebase-functions'

const config = {
  apiKey: "AIzaSyCrW0o6SZztAlE32m_nIARtwxuWfTCM8Jg",
  authDomain: "metabot-187207.firebaseapp.com",
  databaseURL: "https://metabot-187207.firebaseio.com",
  projectId: "metabot-187207",
  storageBucket: "metabot-187207.appspot.com",
  messagingSenderId: "284964654585"
}

firebase.initializeApp(config)

export const helloWorld = functions.https.onRequest((request, response) => {
  const db = firebase.firestore()

  firebase.auth().signInWithEmailAndPassword('manabu.nakajima@speee.jp', 'Password').then(() => {
    db.collection("users").add({
      first: "Alan",
      middle: "Mathison",
      last: "Turing",
      born: 1912
    })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      })
  }).catch((error) => {
    console.error(error)
  });

 response.send("Hello from Firebase!");
});
