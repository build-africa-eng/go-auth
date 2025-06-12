// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, resetPassword } from '../firebase/auth';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';
import { validateEmail, validatePassword } from '../utils/validators';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await loginWithEmail(email, password);
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
      await loginWithGoogle();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

  return (
    <AuthCard title="Welcome Back">
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="space-y-5">
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
        onClick={handleLogin}
        disabled={loading}
        className="auth-button"
        ariaLabel="Login"
      >
        Login
      </Button>
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="google-button"
        ariaLabel="Sign in with Google"
      >
        Sign in with Google
      </Button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Forgot password?{' '}
        <button onClick={handlePasswordReset} className="auth-link" aria-label="Reset Password">
          Reset Password
        </button>
      </p>
      <p className="mt-2 text-center text-sm text-gray-600">
        Don't have an account? <Link to="/register" className="auth-link">Register</Link>
      </p>
    </AuthCard>
  );
};

export default Login;