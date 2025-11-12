import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_CODESPACE_NAME 
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
    : 'https://localhost:8000/api';

  const API_ENDPOINT = `${API_BASE_URL}/leaderboard/`;

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      console.log('Fetching leaderboard from:', API_ENDPOINT);
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
      console.log('Leaderboard API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const leaderboardData = data.results || data || [];
      console.log('Processed leaderboard data:', leaderboardData);
      
      setLeaderboard(leaderboardData);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (position) => {
    if (position === 1) return 'bg-warning text-dark';
    if (position === 2) return 'bg-secondary';
    if (position === 3) return 'bg-warning text-dark';
    return 'bg-primary';
  };

  const getRankIcon = (position) => {
    if (position === 1) return 'bi bi-trophy-fill text-warning';
    if (position === 2) return 'bi bi-award-fill text-secondary';
    if (position === 3) return 'bi bi-award-fill text-warning';
    return 'bi bi-star-fill text-primary';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading leaderboard...</p>
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
            Error Loading Leaderboard
          </h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={fetchLeaderboard}>
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
            <div className="card-header bg-warning text-dark">
              <div className="row align-items-center">
                <div className="col">
                  <h2 className="h4 mb-0">
                    <i className="bi bi-trophy me-2"></i>
                    Fitness Leaderboard
                  </h2>
                </div>
                <div className="col-auto">
                  <button 
                    className="btn btn-dark btn-sm" 
                    onClick={fetchLeaderboard}
                    title="Refresh Leaderboard"
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">
                Compete with others and see where you rank in the fitness challenge!
              </p>
            </div>
          </div>

          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-header">
                    <h5 className="mb-0">🏆 Top Performers</h5>
                  </div>
                  <div className="card-body">
                    <div className="row text-center">
                      {leaderboard.slice(0, 3).map((user, index) => {
                        const position = index + 1;
                        return (
                          <div key={user.id || index} className="col-md-4 mb-3">
                            <div className={`card h-100 ${position === 1 ? 'border-warning' : position === 2 ? 'border-secondary' : 'border-warning'}`}>
                              <div className="card-body">
                                <i className={`${getRankIcon(position)} display-4 mb-3`}></i>
                                <h5 className="card-title">{user.username || user.name || 'Unknown User'}</h5>
                                <p className="card-text">
                                  <strong className="text-success">{user.total_points || user.points || 0} points</strong>
                                </p>
                                <span className={`badge ${getRankBadge(position)} fs-6`}>
                                  #{position}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                Full Rankings 
                <span className="badge bg-secondary ms-2">{leaderboard.length}</span>
              </h5>
            </div>
            <div className="card-body p-0">
              {leaderboard.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-trophy display-1 text-muted"></i>
                  <h5 className="text-muted mt-3">No Leaderboard Data</h5>
                  <p className="text-muted">Start competing to see rankings here.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="text-center">
                          <i className="bi bi-hash me-1"></i>
                          Rank
                        </th>
                        <th scope="col">
                          <i className="bi bi-person me-1"></i>
                          User
                        </th>
                        <th scope="col">
                          <i className="bi bi-star me-1"></i>
                          Total Points
                        </th>
                        <th scope="col">
                          <i className="bi bi-activity me-1"></i>
                          Activities
                        </th>
                        <th scope="col">
                          <i className="bi bi-calendar3 me-1"></i>
                          Last Active
                        </th>
                        <th scope="col">
                          <i className="bi bi-graph-up me-1"></i>
                          Streak
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((user, index) => {
                        const position = index + 1;
                        return (
                          <tr key={user.id || index} className={position <= 3 ? 'table-warning' : ''}>
                            <td className="text-center">
                              <div className="d-flex align-items-center justify-content-center">
                                <i className={`${getRankIcon(position)} me-2`}></i>
                                <span className={`badge ${getRankBadge(position)} fs-6`}>
                                  #{position}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-circle bg-primary text-white me-2">
                                  {(user.username || user.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="fw-semibold">
                                    {user.username || user.name || 'Unknown User'}
                                  </div>
                                  {user.team && (
                                    <small className="text-muted">Team: {user.team}</small>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-success fs-6">
                                <i className="bi bi-star-fill me-1"></i>
                                {user.total_points || user.points || 0}
                              </span>
                            </td>
                            <td>
                              <i className="bi bi-activity me-1 text-muted"></i>
                              {user.total_activities || user.activities || 0}
                            </td>
                            <td>
                              <small className="text-muted">
                                {user.last_active || user.updated_at || 'N/A'}
                              </small>
                            </td>
                            <td>
                              <span className="badge bg-info text-dark">
                                <i className="bi bi-fire me-1"></i>
                                {user.streak || user.current_streak || 0} days
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <i className="bi bi-people display-4 text-primary mb-3"></i>
                  <h5>Total Competitors</h5>
                  <h3 className="text-primary">{leaderboard.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <i className="bi bi-star display-4 text-warning mb-3"></i>
                  <h5>Total Points</h5>
                  <h3 className="text-warning">
                    {leaderboard.reduce((sum, user) => sum + (user.total_points || user.points || 0), 0)}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <i className="bi bi-activity display-4 text-success mb-3"></i>
                  <h5>Total Activities</h5>
                  <h3 className="text-success">
                    {leaderboard.reduce((sum, user) => sum + (user.total_activities || user.activities || 0), 0)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;