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
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    toast.success('Account created successfully!');
    return user;
  } catch (error) {
    throw new Error(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    toast.success('Logged in successfully!');
    return user;
  } catch (error) {
    throw new Error(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    toast.success('Signed in with Google!');
    return user;
  } catch (error) {
    throw new Error(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent!');
  } catch (error) {
    throw new Error(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
  }
};

export const updateUserProfile = async (name) => {
  try {
    await updateProfile(auth.currentUser, { displayName: name });
    toast.success('Profile updated successfully!');
  } catch (error) {
    throw new Error(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    toast.success('Logged out successfully!');
  } catch (error) {
    throw new Error(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
  }
};