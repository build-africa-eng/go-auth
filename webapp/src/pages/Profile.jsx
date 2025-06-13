// src/pages/Profile.jsx

import React, { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../firebase/auth';
import { saveUserData } from '../firebase/firestore';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar'; // Assuming Sidebar is in components
import { validateName } from '../utils/validators';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    const nameError = validateName(name);
    if (nameError) {
      setError(nameError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(name);
      await saveUserData(user.uid, { displayName: name }); // More explicit
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Profile Update Error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    // This is a failsafe, but App.jsx should already handle this redirect.
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Corrected margin to account for the 16rem (64 * 0.25rem) sidebar */}
      <main className="flex-1 p-4 ml-0 md:ml-64">
        <AuthCard title="Profile">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="auth-button"
            ariaLabel="Update Profile"
          >
            Update Profile
          </Button>
        </AuthCard>
      </main>
    </div>
  );
};

export default Profile;