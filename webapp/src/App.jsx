import React, { useState, useEffect } from 'react';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth;
if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase Initialization Error:', error.message);
  }
} else {
  console.error('Firebase configuration is missing. Check your VITE_ environment variables.');
}

// Register Component
const Register = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!auth) {
      setError('Firebase is not configured correctly.');
      return;
    }
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && auth) {
      handleRegister();
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-heading">Create Account</h2>
      {error && <p className="error-message">{error}</p>}
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
      <button
        onClick={handleRegister}
        disabled={loading || !auth}
        className="auth-button"
      >
        {loading ? <div className="loading-spinner"></div> : 'Register'}
      </button>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button onClick={() => setPage('login')} className="auth-link">
          Login
        </button>
      </p>
    </div>
  );
};

// Login Component
const Login = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!auth) {
      setError('Firebase is not configured correctly.');
      return;
    }
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && auth) {
      handleLogin();
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-heading">Welcome Back</h2>
      {error && <p className="error-message">{error}</p>}
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
      <button
        onClick={handleLogin}
        disabled={loading || !auth}
        className="auth-button"
      >
        {loading ? <div className="loading-spinner"></div> : 'Login'}
      </button>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button onClick={() => setPage('register')} className="auth-link">
          Register
        </button>
      </p>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ user }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <div className="dashboard-card">
      <h2 className="auth-heading">Dashboard</h2>
      <p className="text-lg text-gray-700 mb-2">Welcome!</p>
      <p className="text-md text-gray-600 mb-8 break-all">
        Signed in as: <strong className="text-indigo-600">{user.email}</strong>
      </p>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

// Main App Component
function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setPage(currentUser ? 'dashboard' : 'login');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderPage = () => {
    if (loading) {
      return (
        <div className="text-center">
          <div className="loading-spinner h-10 w-10 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading...</p>
        </div>
      );
    }

    if (!auth) {
      return (
        <div className="auth-card">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Configuration Error</h2>
          <p className="text-gray-600">
            Firebase is not configured. Please ensure your <code>VITE_</code> environment variables are set correctly and redeploy.
          </p>
        </div>
      );
    }

    switch (page) {
      case 'dashboard':
        return user ? <Dashboard user={user} /> : <Login setPage={setPage} />;
      case 'register':
        return <Register setPage={setPage} />;
      case 'login':
      default:
        return <Login setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 font-sans p-4">
      {renderPage()}
    </div>
  );
}

export default App;