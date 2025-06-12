// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getUserData } from '../firebase/firestore';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      };
      fetchUserData();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

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
      <Sidebar />
      <div className="flex-1 p-4 ml-0 md:ml-16rem">
        <div className="dashboard-card">
          <h2 className="auth-heading">Dashboard</h2>
          <p className="text-lg text-gray-700 mb-2">
            Welcome, {userData?.name || user.displayName || user.email}!
          </p>
          <p className="text-md text-gray-600 mb-8 break-all">
            Signed in as: <strong className="text-indigo-600">{user.email}</strong>
          </p>
          <div className="chart-container">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Login Activity</h3>
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
          <Button
            onClick={() => setDarkMode(!darkMode)}
            className="auth-button"
            ariaLabel={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;