// src/pages/Profile.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../firebase/auth';
import { saveUserData, getUserData } from '../firebase/firestore';
import { uploadProfilePicture } from '../utils/imgbb';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import { validateName, validateBio } from '../utils/validators';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        console.log('Profile Page Rendered:', {
          user: { uid: user.uid, displayName: user.displayName, email: user.email },
        });
        try {
          const userData = await getUserData(user.uid);
          setName(userData?.name || user.displayName || user.email || '');
          setBio(userData?.bio || '');
          setProfilePicUrl(userData?.profilePic || '');
        } catch (error) {
          console.error('Fetch User Data Error:', error.message);
          toast.error('Failed to load profile data.');
        }
      }
    };
    fetchData();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicUrl(URL.createObjectURL(file)); // Local preview
    }
  };

  const handleUpdateProfile = async () => {
    console.log('Updating Profile:', { name, bio, hasProfilePic: !!profilePic });
    const nameError = validateName(name);
    const bioError = validateBio(bio);
    if (nameError) {
      setError(nameError);
      console.log('Validation Error:', nameError);
      return;
    }
    if (bioError) {
      setError(bioError);
      console.log('Validation Error:', bioError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(name);
      const data = { name, bio };
      if (profilePic) {
        const url = await uploadProfilePicture(profilePic);
        data.profilePic = url;
        setProfilePicUrl(url);
        setProfilePic(null);
      }
      await saveUserData(user.uid, data);
      setSuccess('Profile updated successfully!');
      toast.success('Profile updated!');
    } catch (error) {
      console.error('Profile Update Error:', {
        message: error.message,
        code: error.code || 'unknown',
      });
      setError(error.message || 'Failed to update profile.');
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    console.log('Profile: Redirecting to /login due to no user');
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200">
      <Sidebar />
      <main className="flex-1 p-6 ml-0 md:ml-64">
        <AuthCard title="Profile">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center">
              {profilePicUrl && (
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-indigo-500"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-200 rounded-xl text-gray-800"
                disabled={loading}
              />
            </div>
            {/* Email Display */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <p className="w-full p-4 bg-gray-100 rounded-xl text-gray-800">{user.email}</p>
            </div>
            {/* Name Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value.trim())}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
                disabled={loading}
              />
            </div>
            {/* Bio Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Bio</label>
              <textarea
                placeholder="Tell us about yourself (max 200 characters)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400 resize-y"
                rows="4"
                maxLength="200"
                disabled={loading}
              />
            </div>
          </div>
          <Button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="auth-button mt-6"
            ariaLabel="Update Profile"
          >
            {loading ? <span className="loading-spinner" /> : 'Update Profile'}
          </Button>
        </AuthCard>
      </main>
    </div>
  );
};

export default Profile;