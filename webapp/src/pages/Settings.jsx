// src/pages/Settings.jsx
import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { saveUserData } from '../firebase/firestore';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await saveUserData(user.uid, { notifications });
      setSuccess('Settings saved successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 ml-0 md:ml-16rem">
        <AuthCard title="Settings">
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
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            className="auth-button"
            ariaLabel="Save Settings"
          >
            Save Settings
          </Button>
        </AuthCard>
      </div>
    </div>
  );
};

export default Settings;