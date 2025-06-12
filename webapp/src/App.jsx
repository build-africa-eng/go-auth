import React, { useState, useEffect } from 'react';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// --- Firebase Configuration for Vite ---
// Vite exposes environment variables on the `import.meta.env` object.
// Variables must be prefixed with VITE_ to be exposed to the client.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// --- Determine Final Config (Vite vs. Platform-Specific) ---
const finalConfig = (firebaseConfig.apiKey) 
    ? firebaseConfig 
    : (typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {});

// --- Initialize Firebase ---
let app;
let auth;
// Initialize only if the config is valid to prevent errors.
if (finalConfig && finalConfig.apiKey) {
    app = initializeApp(finalConfig);
    auth = getAuth(app);
} else {
    // This will be logged in the browser console if config is missing.
    console.error("Firebase configuration is missing or invalid. App cannot be initialized.");
}

// --- Register Component ---
const Register = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!auth) {
        setError("Firebase is not configured. Please check environment variables.");
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
      // onAuthStateChanged will handle navigation
    } catch (error) {
      setError(error.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-sm transform transition-all hover:scale-105">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">Create Account</h2>
      {error && <p className="mb-4 text-center text-sm font-medium text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
      <div className="space-y-5">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <button
        onClick={handleRegister}
        disabled={loading || !auth}
        className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-300 font-semibold text-lg flex items-center justify-center"
      >
        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Register'}
      </button>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button onClick={() => setPage('login')} className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none">
          Login
        </button>
      </p>
    </div>
  );
};

// --- Login Component ---
const Login = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!auth) {
        setError("Firebase is not configured. Please check environment variables.");
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
      // onAuthStateChanged will handle navigation
    } catch (error) {
      setError(error.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-sm transform transition-all hover:scale-105">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">Welcome Back</h2>
       {error && <p className="mb-4 text-center text-sm font-medium text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
      <div className="space-y-5">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <button
        onClick={handleLogin}
        disabled={loading || !auth}
        className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-300 font-semibold text-lg flex items-center justify-center"
      >
        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Login'}
      </button>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button onClick={() => setPage('register')} className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none">
          Register
        </button>
      </p>
    </div>
  );
};

// --- Dashboard Component ---
const Dashboard = ({ user }) => {

  const handleLogout = () => {
    signOut(auth).catch((error) => {
        console.error("Logout Error:", error);
    });
    // onAuthStateChanged will handle navigation
  };

  return (
     <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-lg text-gray-700 mb-2">Welcome!</p>
        <p className="text-md text-gray-600 mb-8 break-all">
            Signed in as: <strong className="text-indigo-600">{user.email}</strong>
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors duration-300 font-semibold text-lg"
        >
          Logout
        </button>
    </div>
  );
};

// --- Main App Component ---
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
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-700">Loading...</p>
            </div>
        )
    }
    
    if (!auth) {
        return (
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold mb-4 text-red-700">Configuration Error</h2>
                <p className="text-gray-600">Firebase is not configured. Please ensure your `VITE_` environment variables are set correctly on your hosting provider and redeploy.</p>
            </div>
        )
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

