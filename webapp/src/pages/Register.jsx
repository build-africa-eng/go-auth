// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerWithEmail, loginWithGoogle } from '../firebase/auth';
import { saveUserData } from '../firebase/firestore';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';
import { validateEmail, validatePassword, validateName } from '../utils/validators';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = validateName(name);
    if (emailError || passwordError || nameError) {
      setError(emailError || passwordError || nameError);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await registerWithEmail(email, password, name);
      await saveUserData(user.uid, { name, createdAt: new Date().toISOString() });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await loginWithGoogle();
      await saveUserData(user.uid, { name: user.displayName, createdAt: new Date().toISOString() });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleRegister();
    }
  };

  return (
    <AuthCard title="Create Account">
      {error && <p className="error-message">{error}</p>}
      <div className="space-y-5">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value.trim())}
          onKeyPress={handleKeyPress}
          className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          onKeyPress={handleKeyPress}
          className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
          disabled={loading}
        />
      </div>
      <Button
        onClick={handleRegister}
        disabled={loading}
        className="auth-button"
        ariaLabel="Register"
      >
        Register
      </Button>
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="google-button"
        ariaLabel="Sign in with Google"
      >
        Sign in with Google
      </Button>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account? <Link to="/login" className="auth-link">Login</Link>
      </p>
    </AuthCard>
  );
};

export default Register;