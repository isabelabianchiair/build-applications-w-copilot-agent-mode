import React, { useState, useEffect } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_CODESPACE_NAME 
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
    : 'https://localhost:8000/api';

  const API_ENDPOINT = `${API_BASE_URL}/teams/`;

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      console.log('Fetching teams from:', API_ENDPOINT);
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
      console.log('Teams API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const teamsData = data.results || data || [];
      console.log('Processed teams data:', teamsData);
      
      setTeams(teamsData);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading teams...</p>
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
            Error Loading Teams
          </h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={fetchTeams}>
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
            <div className="card-header bg-success text-white">
              <div className="row align-items-center">
                <div className="col">
                  <h2 className="h4 mb-0">
                    <i className="bi bi-people me-2"></i>
                    Teams Management
                  </h2>
                </div>
                <div className="col-auto">
                  <button 
                    className="btn btn-light btn-sm" 
                    onClick={fetchTeams}
                    title="Refresh Teams"
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">
                Create and manage fitness teams. Join forces with others to achieve your fitness goals together!
              </p>
            </div>
          </div>

          {/* Teams Grid */}
          {teams.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-people display-1 text-muted"></i>
                <h5 className="text-muted mt-3">No Teams Found</h5>
                <p className="text-muted">Create or join a team to start collaborating on fitness goals.</p>
                <button className="btn btn-success btn-lg">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Team
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Team Cards Grid */}
              <div className="row g-4 mb-4">
                {teams.map((team, index) => (
                  <div key={team.id || index} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm team-card">
                      <div className="card-header bg-light">
                        <div className="row align-items-center">
                          <div className="col">
                            <h6 className="mb-0 text-truncate">
                              <i className="bi bi-flag me-1 text-success"></i>
                              {team.name || 'Unnamed Team'}
                            </h6>
                          </div>
                          <div className="col-auto">
                            <span className="badge bg-success">
                              {team.member_count || team.members?.length || 0} members
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="card-text text-muted small">
                          {team.description || 'No description available'}
                        </p>
                        
                        {/* Team Stats */}
                        <div className="row text-center mb-3">
                          <div className="col-4">
                            <div className="border rounded p-2">
                              <div className="h6 mb-0 text-primary">{team.total_points || 0}</div>
                              <small className="text-muted">Points</small>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="border rounded p-2">
                              <div className="h6 mb-0 text-warning">{team.total_activities || 0}</div>
                              <small className="text-muted">Activities</small>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="border rounded p-2">
                              <div className="h6 mb-0 text-info">{team.rank || 'N/A'}</div>
                              <small className="text-muted">Rank</small>
                            </div>
                          </div>
                        </div>

                        {/* Team Members Preview */}
                        {team.members && team.members.length > 0 && (
                          <div className="mb-3">
                            <small className="text-muted d-block mb-2">Team Members:</small>
                            <div className="d-flex flex-wrap gap-1">
                              {team.members.slice(0, 3).map((member, idx) => (
                                <span key={idx} className="badge bg-light text-dark border">
                                  {member.username || member.name || `Member ${idx + 1}`}
                                </span>
                              ))}
                              {team.members.length > 3 && (
                                <span className="badge bg-secondary">
                                  +{team.members.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="text-center">
                          <small className="text-muted">
                            Created: {team.created_at || team.date_created || 'N/A'}
                          </small>
                        </div>
                      </div>
                      <div className="card-footer bg-transparent">
                        <div className="btn-group w-100" role="group">
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="bi bi-eye me-1"></i>
                            View
                          </button>
                          <button className="btn btn-outline-success btn-sm">
                            <i className="bi bi-person-plus me-1"></i>
                            Join
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Teams Table */}
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="mb-0">
                    All Teams Overview 
                    <span className="badge bg-secondary ms-2">{teams.length}</span>
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">
                            <i className="bi bi-flag me-1"></i>
                            Team Name
                          </th>
                          <th scope="col">
                            <i className="bi bi-person-check me-1"></i>
                            Captain
                          </th>
                          <th scope="col">
                            <i className="bi bi-people me-1"></i>
                            Members
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
                            <i className="bi bi-trophy me-1"></i>
                            Rank
                          </th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teams.map((team, index) => (
                          <tr key={team.id || index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="team-avatar bg-success text-white me-2">
                                  {(team.name || 'T').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="fw-semibold">{team.name || 'Unnamed Team'}</div>
                                  <small className="text-muted">{team.description || 'No description'}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-primary">
                                {team.captain || team.created_by || 'Unknown'}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-info text-dark">
                                <i className="bi bi-people-fill me-1"></i>
                                {team.member_count || team.members?.length || 0}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-warning text-dark">
                                <i className="bi bi-star-fill me-1"></i>
                                {team.total_points || 0}
                              </span>
                            </td>
                            <td>
                              <i className="bi bi-activity me-1 text-muted"></i>
                              {team.total_activities || 0}
                            </td>
                            <td>
                              <span className="badge bg-secondary">
                                #{team.rank || index + 1}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <button className="btn btn-outline-primary btn-sm" title="View Team">
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button className="btn btn-outline-success btn-sm" title="Join Team">
                                  <i className="bi bi-person-plus"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Create Team Button */}
          <div className="text-center mt-4">
            <button className="btn btn-success btn-lg">
              <i className="bi bi-plus-circle me-2"></i>
              Create New Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;