// src/firebase/firestore.js
import { db } from './config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const saveUserData = async (userId, data) => {
  try {
    await setDoc(doc(db, 'users', userId), data, { merge: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    throw new Error(error.message);
  }
};