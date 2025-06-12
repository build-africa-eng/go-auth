import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
let db;
if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase Initialization Error:', error.message);
  }
} else {
  console.error('Firebase configuration is missing. Check VITE_ environment variables.');
}

// Register Component
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(pwd) ? '' : 'Password must be at least 8 characters with letters and numbers.';
  };

  const handleRegister = async () => {
    if (!auth) {
      setError('Firebase is not configured correctly.');
      return;
    }
    if (!email || !password || !name) {
      setError('Please fill in all fields.');
      return;
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, 'users', user.uid), { name, createdAt: new Date().toISOString() });
      toast.success('Account created successfully!');
    } catch (error) {
      setError(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError('Firebase is not configured correctly.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', user.uid), { name: user.displayName, createdAt: new Date().toISOString() }, { merge: true });
      toast.success('Signed in with Google!');
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
      <button onClick={handleRegister} disabled={loading || !auth} className="auth-button" aria-label="Register">
        {loading ? <div className="loading-spinner"></div> : 'Register'}
      </button>
      <button onClick={handleGoogleSignIn} disabled={loading || !auth} className="google-button" aria-label="Sign in with Google">
        {loading ? <div className="loading-spinner"></div> : 'Sign in with Google'}
      </button>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account? <Link to="/login" className="auth-link">Login</Link>
      </p>
    </div>
  );
};

// Login Component
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      toast.success('Logged in successfully!');
    } catch (error) {
      setError(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError('Firebase is not configured correctly.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', user.uid), { name: user.displayName, createdAt: new Date().toISOString() }, { merge: true });
      toast.success('Signed in with Google!');
    } catch (error) {
      setError(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!auth) {
      setError('Firebase is not configured correctly.');
      return;
    }
    if (!email) {
      setError('Please enter your email to reset password.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox.');
      toast.success('Password reset email sent!');
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
      <button onClick={handleLogin} disabled={loading || !auth} className="auth-button" aria-label="Login">
        {loading ? <div className="loading-spinner"></div> : 'Login'}
      </button>
      <button onClick={handleGoogleSignIn} disabled={loading || !auth} className="google-button" aria-label="Sign in with Google">
        {loading ? <div className="loading-spinner"></div> : 'Sign in with Google'}
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Forgot password? <button onClick={handlePasswordReset} className="auth-link" aria-label="Reset Password">Reset Password</button>
      </p>
      <p className="mt-2 text-center text-sm text-gray-600">
        Don't have an account? <Link to="/register" className="auth-link">Register</Link>
      </p>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ user }) => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (db && user) {
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) setUserData(userDoc.data());
      };
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Login Activity',
        data: [5, 10, 8, 12, 15, 20],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex min-h-screen">
      <div className="sidebar">
        <h3 className="text-xl font-bold mb-6 text-gray-900">Menu</h3>
        <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <Link to="/profile" className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}>
          Profile
        </Link>
        <Link to="/settings" className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`}>
          Settings
        </Link>
        <Link to="/analytics" className={`sidebar-link ${location.pathname === '/analytics' ? 'active' : ''}`}>
          Analytics
        </Link>
        <button
          onClick={() => signOut(auth).then(() => toast.success('Logged out successfully!'))}
          className="logout-button mt-4"
          aria-label="Log out"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 p-4 ml-0 md:ml-16rem">
        <div className="dashboard-card">
          <h2 className="auth-heading">Dashboard</h2>
          <p className="text-lg text-gray-700 mb-2">Welcome, {userData?.name || user.displayName || user.email}!</p>
          <p className="text-md text-gray-600 mb-8 break-all">
            Signed in as: <strong className="text-indigo-600">{user.email}</strong>
          </p>
          <div className="chart-container">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Login Activity</h3>
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="auth-button"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Profile Component
const Profile = ({ user }) => {
  const [name, setName] = useState(user.displayName || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!auth || !db) {
      setError('Firebase is not configured correctly.');
      return;
    }
    if (!name) {
      setError('Please enter a name.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      await setDoc(doc(db, 'users', user.uid), { name }, { merge: true });
      setSuccess('Profile updated successfully!');
      toast.success('Profile updated successfully!');
    } catch (error) {
      setError(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="sidebar">
        <h3 className="text-xl font-bold mb-6 text-gray-900">Menu</h3>
        <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
        <Link to="/profile" className="sidebar-link active">Profile</Link>
        <Link to="/settings" className="sidebar-link">Settings</Link>
        <Link to="/analytics" className="sidebar-link">Analytics</Link>
        <button
          onClick={() => signOut(auth).then(() => toast.success('Logged out successfully!'))}
          className="logout-button mt-4"
          aria-label="Log out"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 p-4 ml-0 md:ml-16rem">
        <div className="dashboard-card">
          <h2 className="auth-heading">Profile</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
              disabled={loading}
            />
          </div>
          <button onClick={handleUpdateProfile} disabled={loading} className="auth-button" aria-label="Update Profile">
            {loading ? <div className="loading-spinner"></div> : 'Update Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Settings Component
const Settings = ({ user }) => {
  const [notifications, setNotifications] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    if (!db) {
      setError('Firebase is not configured correctly.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await setDoc(doc(db, 'users', user.uid), { notifications }, { merge: true });
      setSuccess('Settings saved successfully!');
      toast.success('Settings saved successfully!');
    } catch (error) {
      setError(error.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="sidebar">
        <h3 className="text-xl font-bold mb-6 text-gray-900">Menu</h3>
        <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
        <Link to="/profile" className="sidebar-link">Profile</Link>
        <Link to="/settings" className="sidebar-link active">Settings</Link>
        <Link to="/analytics" className="sidebar-link">Analytics</Link>
        <button
          onClick={() => signOut(auth).then(() => toast.success('Logged out successfully!'))}
          className="logout-button mt-4"
          aria-label="Log out"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 p-4 ml-0 md:ml-16rem">
        <div className="dashboard-card">
          <h2 className="auth-heading">Settings</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="space-y-5">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-5 w-5 text-indigo-600"
                disabled={loading}
              />
              <span className="text-gray-700">Enable Notifications</span>
            </label>
          </div>
          <button onClick={handleSaveSettings} disabled={loading} className="auth-button" aria-label="Save Settings">
            {loading ? <div className="loading-spinner"></div> : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Analytics Component
const Analytics = () => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Login Activity',
        data: [5, 10, 8, 12, 15, 20],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex min-h-screen">
      <div className="sidebar">
        <h3 className="text-xl font-bold mb-6 text-gray-900">Menu</h3>
        <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
        <Link to="/profile" className="sidebar-link">Profile</Link>
        <Link to="/settings" className="sidebar-link">Settings</Link>
        <Link to="/analytics" className="sidebar-link active">Analytics</Link>
        <button
          onClick={() => signOut(auth).then(() => toast.success('Logged out successfully!'))}
          className="logout-button mt-4"
          aria-label="Log out"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 p-4 ml-0 md:ml-16rem">
        <div className="dashboard-card">
          <h2 className="auth-heading">Analytics</h2>
          <div className="chart-container">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Login Activity</h3>
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
        <div className="text-center">
          <div className="loading-spinner h-10 w-10 border-i