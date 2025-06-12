// src/utils/validators.js
export const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password) ? '' : 'Password must be at least 8 characters with letters and numbers.';
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? '' : 'Please enter a valid email address.';
};

export const validateName = (name) => {
  return name.trim().length > 0 ? '' : 'Please enter a valid name.';
};