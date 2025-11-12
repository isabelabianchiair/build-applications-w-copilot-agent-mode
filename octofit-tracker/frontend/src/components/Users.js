import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_CODESPACE_NAME 
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
    : 'https://localhost:8000/api';

  const API_ENDPOINT = `${API_BASE_URL}/users/`;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from:', API_ENDPOINT);
      setLoading(true);
      
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Users API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const usersData = data.results || data || [];
      console.log('Processed users data:', usersData);
      
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 'badge bg-success' : 'badge bg-secondary';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error Loading Users
          </h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={fetchUsers}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          {/* Header Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <div className="row align-items-center">
                <div className="col">
                  <h2 className="h4 mb-0">
                    <i className="bi bi-person-circle me-2"></i>
                    User Management
                  </h2>
                </div>
                <div className="col-auto">
                  <button 
                    className="btn btn-light btn-sm" 
                    onClick={fetchUsers}
                    title="Refresh Users"
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">
                Manage user profiles, track fitness progress, and monitor community engagement.
              </p>
            </div>
          </div>

          {/* User Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <i className="bi bi-people display-4 text-primary mb-3"></i>
                  <h5>Total Users</h5>
                  <h3 className="text-primary">{users.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <i className="bi bi-person-check display-4 text-success mb-3"></i>
                  <h5>Active Users</h5>
                  <h3 className="text-success">
                    {users.filter(user => user.is_active !== false).length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <i className="bi bi-star display-4 text-warning mb-3"></i>
                  <h5>Total Points</h5>
                  <h3 className="text-warning">
                    {users.reduce((sum, user) => sum + (user.total_points || user.points || 0), 0)}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <i className="bi bi-activity display-4 text-danger mb-3"></i>
                  <h5>Total Activities</h5>
                  <h3 className="text-danger">
                    {users.reduce((sum, user) => sum + (user.total_activities || user.activities || 0), 0)}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                All Users 
                <span className="badge bg-secondary ms-2">{users.length}</span>
              </h5>
            </div>
            <div className="card-body p-0">
              {users.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-person-x display-1 text-muted"></i>
                  <h5 className="text-muted mt-3">No Users Found</h5>
                  <p className="text-muted">No registered users in the system yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">
                          <i className="bi bi-hash me-1"></i>
                          ID
                        </th>
                        <th scope="col">
                          <i className="bi bi-person me-1"></i>
                          User
                        </th>
                        <th scope="col">
                          <i className="bi bi-envelope me-1"></i>
                          Email
                        </th>
                        <th scope="col">
                          <i className="bi bi-star me-1"></i>
                          Points
                        </th>
                        <th scope="col">
                          <i className="bi bi-activity me-1"></i>
                          Activities
                        </th>
                        <th scope="col">
                          <i className="bi bi-people me-1"></i>
                          Team
                        </th>
                        <th scope="col">
                          <i className="bi bi-check-circle me-1"></i>
                          Status
                        </th>
                        <th scope="col">
                          <i className="bi bi-calendar3 me-1"></i>
                          Joined
                        </th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.id || index}>
                          <td>
                            <span className="badge bg-light text-dark">
                              {user.id || index + 1}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle bg-info text-white me-2">
                                {(user.username || user.first_name || user.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-semibold">
                                  {user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || 'Unknown User'}
                                </div>
                                {(user.first_name || user.last_name) && user.username && (
                                  <small className="text-muted">@{user.username}</small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              {user.email || 'No email provided'}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-star-fill me-1"></i>
                              {user.total_points || user.points || 0}
                            </span>
                          </td>
                          <td>
                            <i className="bi bi-activity me-1 text-muted"></i>
                            {user.total_activities || user.activities || 0}
                          </td>
                          <td>
                            {user.team ? (
                              <span className="badge bg-success">
                                <i className="bi bi-people me-1"></i>
                                {user.team}
                              </span>
                            ) : (
                              <span className="text-muted small">No team</span>
                            )}
                          </td>
                          <td>
                            <span className={getStatusBadge(user.is_active)}>
                              <i className={`bi ${user.is_active !== false ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                              {getStatusText(user.is_active)}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {user.date_joined || user.created_at || user.joined || 'N/A'}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <button className="btn btn-outline-primary btn-sm" title="View Profile">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-outline-secondary btn-sm" title="Edit User">
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-outline-info btn-sm" title="Send Message">
                                <i className="bi bi-chat"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="text-center mt-4">
            <button className="btn btn-info btn-lg me-2">
              <i className="bi bi-person-plus me-2"></i>
              Add New User
            </button>
            <button className="btn btn-outline-secondary btn-lg">
              <i className="bi bi-download me-2"></i>
              Export Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;