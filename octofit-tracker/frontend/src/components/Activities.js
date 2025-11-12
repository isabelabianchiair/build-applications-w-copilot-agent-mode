import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_CODESPACE_NAME 
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
    : 'https://localhost:8000/api';

  const API_ENDPOINT = `${API_BASE_URL}/activities/`;

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      console.log('Fetching activities from:', API_ENDPOINT);
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
      console.log('Activities API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const activitiesData = data.results || data || [];
      console.log('Processed activities data:', activitiesData);
      
      setActivities(activitiesData);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading activities...</p>
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
            Error Loading Activities
          </h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={fetchActivities}>
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
            <div className="card-header bg-primary text-white">
              <div className="row align-items-center">
                <div className="col">
                  <h2 className="h4 mb-0">
                    <i className="bi bi-calendar-check me-2"></i>
                    Activities Tracker
                  </h2>
                </div>
                <div className="col-auto">
                  <button 
                    className="btn btn-light btn-sm" 
                    onClick={fetchActivities}
                    title="Refresh Activities"
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">
                Track and monitor your fitness activities, workouts, and progress over time.
              </p>
            </div>
          </div>

          {/* Activities Table */}
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                Recent Activities 
                <span className="badge bg-secondary ms-2">{activities.length}</span>
              </h5>
            </div>
            <div className="card-body p-0">
              {activities.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <h5 className="text-muted mt-3">No Activities Found</h5>
                  <p className="text-muted">Start tracking your fitness activities to see them here.</p>
                  <button className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i>
                    Add Activity
                  </button>
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
                          <i className="bi bi-activity me-1"></i>
                          Activity Type
                        </th>
                        <th scope="col">
                          <i className="bi bi-stopwatch me-1"></i>
                          Duration
                        </th>
                        <th scope="col">
                          <i className="bi bi-fire me-1"></i>
                          Calories
                        </th>
                        <th scope="col">
                          <i className="bi bi-calendar3 me-1"></i>
                          Date
                        </th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity, index) => (
                        <tr key={activity.id || index}>
                          <td>
                            <span className="badge bg-light text-dark">
                              {activity.id || index + 1}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle bg-primary text-white me-2">
                                {activity.user_name ? activity.user_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <span>{activity.user_name || activity.user || 'Unknown User'}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info text-dark">
                              {activity.activity_type || 'General'}
                            </span>
                          </td>
                          <td>
                            <i className="bi bi-clock me-1 text-muted"></i>
                            {activity.duration || 'N/A'} min
                          </td>
                          <td>
                            <i className="bi bi-fire me-1 text-warning"></i>
                            {activity.calories_burned || activity.calories || 0} cal
                          </td>
                          <td>
                            <small className="text-muted">
                              {activity.created_at || activity.date || 'N/A'}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <button className="btn btn-outline-primary btn-sm" title="View Details">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-outline-secondary btn-sm" title="Edit">
                                <i className="bi bi-pencil"></i>
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

          {/* Add Activity Button */}
          <div className="text-center mt-4">
            <button className="btn btn-success btn-lg">
              <i className="bi bi-plus-circle me-2"></i>
              Log New Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;