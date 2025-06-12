// src/firebase/auth.js
import { auth } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
} from 'firebase/auth';
import toast from 'react-hot-toast';

export const registerWithEmail = async (email, password, name) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, ..

System: It looks like the previous response was cut off mid-sentence. I'll complete the modularization of your React app, ensuring all components, Firebase logic, and utilities are organized into separate files. Below is the fully modularized version of your app, incorporating all features (login, register, dashboard, profile, settings, analytics, Google Sign-In, Firestore, dark mode, and toast notifications) while maintaining compatibility with Tailwind CSS v4 and Firebase v11.6.1. I'll also address any potential improvements for scalability and maintainability.

---

### Directory Structure