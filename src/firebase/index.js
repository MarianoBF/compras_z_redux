import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const {
  REACT_APP_APIKEY,
  REACT_APP_SENDERID,
  REACT_APP_APPID,
} = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_APIKEY,
  authDomain: "compras-z.firebaseapp.com",
  projectId: "compras-z",
  storageBucket: "compras-z.appspot.com",
  messagingSenderId: REACT_APP_SENDERID,
  appId: REACT_APP_APPID,
};

const app = firebase.initializeApp(firebaseConfig);

export const getFirebase = () => app;

export const getFirestore = () => firebase.firestore(app);

export function updateDB(collection, items) {
  let db = firebase.firestore().collection(collection);
  items.forEach(item => db.doc(String(item.id)).set({...item}));
}

export function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then(res=>res.user)
}

export function logoutFromGoogle() {
  firebase.auth().signOut();
}