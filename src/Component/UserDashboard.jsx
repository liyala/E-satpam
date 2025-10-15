import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getUserDashboard();
      setDashboardData(response.data.message);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setDashboardData('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.username} ({user?.role})</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>{dashboardData}</h2>
          <p>You are logged in as {user?.role}</p>
        </div>

        <div className="user-section">
          <h3>Your Profile</h3>
          <div className="profile-info">
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> 
              <span className={`role-badge role-${user?.role}`}>
                {user?.role}
              </span>
            </p>
            <p><strong>User ID:</strong> {user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
