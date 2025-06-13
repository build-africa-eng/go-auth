// src/utils/validators.js
export const validateEmail = (email) => {
  if (!email) return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format.';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return '';
};

export const validateName = (name) => {
  if (!name) return 'Name is required.';
  if (name.length < 2) return 'Name must be at least 2 characters.';
  return '';
};

export const validateBio = (bio) => {
  if (bio.length > 200) return 'Bio must be 200 characters or less.';
  return '';
};