import firebase from 'firebase/app';
import 'firebase/auth';
import type { User } from './entities/User';

const firebaseConfig = {
  apiKey: 'AIzaSyAratoNewffYblMYrVrGNdgfZ_WmijwwTc',
  authDomain: 'ticket-crawler-a456e.firebaseapp.com',
  databaseURL: 'https://ticket-crawler-a456e.firebaseio.com',
  projectId: 'ticket-crawler-a456e',
  storageBucket: 'ticket-crawler-a456e.appspot.com',
  messagingSenderId: '671959365623',
  appId: '1:671959365623:web:f0d5e5a912f5a42cb160f2',
};

type AuthUnsubscribe = () => void;
export function initAuth(onAuthStateChanged: (user: User | null) => void): AuthUnsubscribe {
  firebase.initializeApp(firebaseConfig);
  const unsubscribe = firebase.auth().onAuthStateChanged(async firebaseUser => {
    const user = await mapUser(firebaseUser);
    onAuthStateChanged(user);
  });
  return () => unsubscribe();
}

async function mapUser(firebaseUser: firebase.User): Promise<User | null> {
  if (!firebaseUser) {
    return null;
  }
  const accessToken = await firebase.auth().currentUser.getIdToken();
  return {
    email: firebaseUser.email,
    accessToken,
  };
}

export async function login(email: string, password: string) {
  const credentials = await firebase.auth().signInWithEmailAndPassword(email, password);
  return mapUser(credentials.user);
}
