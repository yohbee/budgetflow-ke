import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

export const defaultCategories = [
  { name: 'Groceries', limit: 250, icon: '🛒' },
  { name: 'Fare', limit: 250, icon: '🚌' },
  { name: 'Food', limit: 500, icon: '🍽️' },
  { name: 'Airtime', limit: 140, icon: '📱' },
  { name: 'Long-term savings', limit: 500, icon: '🏦' },
  { name: 'Emergency fund', limit: 360, icon: '🛟' },
  { name: 'Short-term savings', limit: 500, icon: '🎯' }
];

export function userDoc(userId, ...path) {
  return doc(db, 'users', userId, ...path);
}

export function userCollection(userId, name) {
  return collection(db, 'users', userId, name);
}

export async function ensureUserSetup(userId) {
  const settingsRef = userDoc(userId, 'settings', 'main');
  const snap = await getDoc(settingsRef);
  if (!snap.exists()) {
    await setDoc(settingsRef, { totalBudget: 3000, currency: 'KES', createdAt: serverTimestamp() });
  }
}

export function listenSettings(userId, callback) {
  return onSnapshot(userDoc(userId, 'settings', 'main'), snap => {
    callback(snap.exists() ? snap.data() : { totalBudget: 3000, currency: 'KES' });
  });
}

export function listenCategories(userId, callback) {
  return onSnapshot(userCollection(userId, 'categories'), async snap => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (list.length === 0) {
      await Promise.all(defaultCategories.map(c => addDoc(userCollection(userId, 'categories'), c)));
    }
    callback(list);
  });
}

export function listenTransactions(userId, callback) {
  const q = query(userCollection(userId, 'transactions'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export function updateSettings(userId, data) {
  return updateDoc(userDoc(userId, 'settings', 'main'), data);
}

export function addCategory(userId, category) {
  return addDoc(userCollection(userId, 'categories'), { ...category, limit: Number(category.limit || 0) });
}

export function updateCategory(userId, id, data) {
  return updateDoc(userDoc(userId, 'categories', id), data);
}

export function removeCategory(userId, id) {
  return deleteDoc(userDoc(userId, 'categories', id));
}

export function addTransaction(userId, tx) {
  return addDoc(userCollection(userId, 'transactions'), {
    ...tx,
    amount: Number(tx.amount || 0),
    createdAt: serverTimestamp()
  });
}

export function removeTransaction(userId, id) {
  return deleteDoc(userDoc(userId, 'transactions', id));
}
