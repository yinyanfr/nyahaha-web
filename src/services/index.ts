import axios from 'axios';
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  type DocumentSnapshot,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  type QuerySnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
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
export const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export async function adminLogin(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result?.user;
}

const API_HOST =
  process.env.NODE_ENV === 'production'
    ? 'https://bot-server.yinyan.fr'
    : 'http://localhost:20239';

// const API_HOST = 'https://bot-server.yinyan.fr';

const request = axios.create({ baseURL: API_HOST });

export async function login(loginQuery?: LoginQuery) {
  if (!loginQuery) {
    throw new Error('Invalid login query.');
  }
  const res = await request.post('/auth/login', loginQuery);
  const user = res.data as User;
  if (user) {
    localStorage.setItem('token', loginQuery.hash);
    return user;
  }
}

export async function verifyToken(
  token?: string | null,
): Promise<User | undefined> {
  if (!token) {
    throw new Error('No token.');
  }
  const res = await request.get('/auth/me', {
    headers: {
      Authorization: token,
    },
  });
  const user = res.data as User;
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

export async function getAndCache<T>(collectionName?: string, id?: string) {
  if (!collectionName || !id) {
    throw new Error('Invalid Request.');
  }
  const cacheKey = `get-${collectionName}-${id}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached) as T;
  }

  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data: T = docSnap.data() as T;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
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

export function registerCollectionListener(
  collectionName: string,
  callback: (snapshot: QuerySnapshot) => void,
) {
  return onSnapshot(collection(db, 'songs'), callback);
}

export async function create(collectionName: string, payload: any) {
  const docRef = await addDoc(collection(db, 'songs'), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function update(collectionName: string, id: string, payload: any) {
  await updateDoc(doc(db, collectionName, id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function getFileUrls(refs: string[]) {
  const worker = refs.map(e => getDownloadURL(ref(storage, e)));
  const req = await Promise.allSettled(worker);
  return req
    .filter(e => e.status === 'fulfilled')
    .map(e => (e as PromiseFulfilledResult<string>).value);
}
