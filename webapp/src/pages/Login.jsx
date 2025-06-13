// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../firebase/auth';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';
import { validateEmail, validatePassword } from '../utils/validators';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Email Login Error:', error.message);
      setError(getFriendlyErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Login Error:', error.message);
      setError(getFriendlyErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  const getFriendlyErrorMessage = (message) => {
    if (message.includes('invalid-email')) return 'Invalid email address.';
    if (message.includes('user-not-found')) return 'No user found with this email.';
    if (message.includes('wrong-password')) return 'Incorrect password.';
    if (message.includes('popup-closed-by-user')) return 'Google Sign-In popup was closed.';
    if (message.includes('popup-blocked')) return 'Popup blocked by browser. Please allow popups.';
    if (message.includes('unauthorized-domain')) return 'This domain is not authorized for Google Sign-In.';
    if (message.includes('invalid-credential')) return 'Invalid Google credentials. Please try again.';
    return message || 'An error occurred. Please try again.';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
      <AuthCard title="Welcome Back">
        {error && <p className="error-message">{error}</p>}
        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
            disabled={loading}
          />
        </div>
        <Button
          onClick={handleEmailLogin}
          disabled={loading}
          className="auth-button"
          ariaLabel="Login"
        >
          {loading ? <span className="loading-spinner" /> : 'Login'}
        </Button>
        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="google-button"
          ariaLabel="Sign in with Google"
        >
          {loading ? <span className="loading-spinner" /> : 'Sign in with Google'}
        </Button>
        <div className="text-center mt-4">
          <a href="/reset-password" className="auth-link">
            Forgot password? Reset Password
          </a>
        </div>
        <div className="text-center mt-2">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="auth-link">
              Register
            </a>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default Login;