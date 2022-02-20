import firebase from 'firebase/app';
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/database';    // for realtime database
import 'firebase/firestore';   // for cloud firestore

const firebaseConfig = {
    apiKey: "AIzaSyBZeoDkn6kVUAsJpj9_jXTOklaA59Sze0g",
    authDomain: "messaging-app-mern-bd068.firebaseapp.com",
    projectId: "messaging-app-mern-bd068",
    storageBucket: "messaging-app-mern-bd068.appspot.com",
    messagingSenderId: "408147703996",
    appId: "1:408147703996:web:aa6a9bcae4a65d1d2e78b9"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db
