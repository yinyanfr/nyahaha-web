import axios from 'axios';
import { initializeApp } from 'firebase/app';
import {
  type DocumentSnapshot,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCCbBys8EmimnAg-Wzjhiszlf7UuUxGfok',
  authDomain: 'nyahaha-bot.firebaseapp.com',
  projectId: 'nyahaha-bot',
  storageBucket: 'nyahaha-bot.appspot.com',
  messagingSenderId: '61656633354',
  appId: '1:61656633354:web:f3083326a49ca9bcc80ff3',
  measurementId: 'G-ZGH9QJDKXM',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const API_HOST =
  process.env.NODE_ENV === 'production'
    ? 'https://bot-server.yinyan.fr'
    : 'http://localhost:20239';

const request = axios.create({ baseURL: API_HOST });

export async function login(loginQuery?: LoginQuery) {
  if (!loginQuery) {
    throw new Error('Invalid login query.');
  }
  const res = await request.post('/auth/login', loginQuery);
  const user = res.data;
  if (user) {
    localStorage.setItem('token', loginQuery.hash);
    return user;
  }
}

export async function verifyToken(token?: string | null) {
  if (!token) {
    throw new Error('No token.');
  }
  const res = await request.get('/auth/me', {
    headers: {
      Authorization: token,
    },
  });
  const user = res.data;
  if (user) {
    return user;
  }
}

export async function get<T>(collectionName?: string, id?: string) {
  if (!collectionName || !id) {
    throw new Error('Invalid Request.');
  }
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as T;
  }
  return null;
}

export function registerDocListener(
  collectionName: string,
  id: string,
  callback: (snapshot: DocumentSnapshot) => void,
) {
  return onSnapshot(doc(db, collectionName, id), callback);
}

export async function getFileUrls(refs: string[]) {
  const worker = refs.map(e => getDownloadURL(ref(storage, e)));
  const req = await Promise.allSettled(worker);
  return req
    .filter(e => e.status === 'fulfilled')
    .map(e => (e as PromiseFulfilledResult<string>).value);
}
