import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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

export async function login(loginQuery?: LoginQuery) {
  if (!loginQuery) {
    throw new Error('Invalid login query.');
  }
  const { id, auth_date, hash } = loginQuery;
  const userQuery = query(collection(db, 'users'), where('uid', '==', id));
  const userSnapshot = await getDocs(userQuery);
  if (userSnapshot.empty) {
    const userRef = await addDoc(collection(db, 'users'), {
      uid: id,
      auth_date,
      hash,
      role: 'user',
    });
    return {
      id: userRef.id,
      uid: id,
      auth_date,
      hash,
      role: 'user',
    };
  } else {
    const userDataList: User[] = [];
    userSnapshot.forEach(e => {
      userDataList.push({ ...(e.data() as User), id: e.id });
    });
    return userDataList[0];
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
