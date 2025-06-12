import React, { useState, useEffect } from 'react';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    signInAnonymously,
    signInWithCustomToken
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// --- Firebase Configuration ---
// This logic checks for environment variables from a hosting provider like Cloudflare.
// If not found, it falls back to the special __firebase_config variable for this environment.
// Note for Cloudflare/other hosts: Environment variables must be prefixed (e.g., REACT_APP_ or VITE_).
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const finalConfig = (firebaseConfig.apiKey) 
    ? firebaseConfig 
    : (typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {});

// --- Initialize Firebase ---
// Initialize only if the config is valid to prevent errors.
let app;
let auth;
if (finalConfig.apiKey) {
    app = initializeApp(finalConfig);
    auth = getAuth(app);
} else {
    console.error("Firebase configuration is missing. App cannot be initialized.");
}


// --- Register Component ---
const Register = ({ setPage, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!auth) {
        setError("Firebase is not configured correctly.");
        return;
    }
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle the user state update
      // and subsequent navigation to the dashboard.
    } catch (error) {
      setError(error.message.replace('Firebase: ', ''));
      setLoading(false);
    }
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
        {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : 'Register'}
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
const Login = ({ setPage, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!auth) {
        setError("Firebase is not configured correctly.");
        return;
    }
    if (!email || !password) {
        setError('Please enter both email and password.');
        return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
       // The onAuthStateChanged listener will handle the user state update
       // and subsequent navigation to the dashboard.
    } catch (error) {
      setError(error.message.replace('Firebase: ', ''));
      setLoading(false);
    }
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
        {loading ? (
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : 'Login'}
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
const Dashboard = ({ user, setUser }) => {

  const handleLogout = () => {
    signOut(auth).catch((error) => {
        console.error("Logout Error:", error);
    });
    // The onAuthStateChanged listener will set the user to null
    // and trigger the view change.
  };

  return (
     <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-lg text-gray-700 mb-2">Welcome back!</p>
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
  const [page, setPage] = useState('login'); // 'login', 'register', or 'dashboard'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To show a loader while checking auth state

  // Effect to handle auth state changes
  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }
    // This function will be called whenever the user's sign-in state changes.
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if(currentUser) {
            setUser(currentUser);
            setPage('dashboard');
        } else {
             // If no user, and we're not in the special environment, we just show the login page.
            setUser(null);
            setPage('login');
        }
        setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  const renderPage = () => {
    if (loading) {
        return (
             <div className="text-center">
                 <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg text-gray-700">Loading...</p>
            </div>
        )
    }
    
    if (!auth) {
        return (
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold mb-4 text-red-700">Configuration Error</h2>
                <p className="text-gray-600">Firebase is not configured. Please ensure your environment variables are set correctly on your hosting provider.</p>
            </div>
        )
    }

    switch (page) {
      case 'dashboard':
        return user ? <Dashboard user={user} setUser={setUser} /> : <Login setPage={setPage} setUser={setUser} />;
      case 'register':
        return <Register setPage={setPage} setUser={setUser} />;
      case 'login':
      default:
        return <Login setPage={setPage} setUser={setUser} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 font-sans p-4">
      {renderPage()}
    </div>
  );
}

export default App;
