import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBJloGEReetkAN9SyWLsKtmGBY--15BVrE",
  authDomain: "retifica-monteiro.firebaseapp.com",
  projectId: "retifica-monteiro",
  storageBucket: "retifica-monteiro.firebasestorage.app",
  messagingSenderId: "379556838037",
  appId: "1:379556838037:web:ea4008acaa2f83205d399c",
  measurementId: "G-9Y6QDKCMG6"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
