import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadUsers();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getAdminDashboard();
      setDashboardData(response.data.message);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setDashboardData('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await authAPI.updateUserRole(userId, newRole);
      loadUsers(); // refresh user list
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
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

        <div className="admin-section">
          <h3>User Management</h3>
          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(userItem => (
                  <tr key={userItem.id}>
                    <td>{userItem.id}</td>
                    <td>{userItem.username}</td>
                    <td>{userItem.email}</td>
                    <td>
                      <span className={`role-badge role-${userItem.role}`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td>
                      {userItem.id !== user.id ? (
                        <select 
                          value={userItem.role}
                          onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="current-user">Current User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

export default AdminDashboard;
