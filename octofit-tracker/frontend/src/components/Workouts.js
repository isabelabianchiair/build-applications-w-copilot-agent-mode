import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_CODESPACE_NAME 
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
    : 'https://localhost:8000/api';

  const API_ENDPOINT = `${API_BASE_URL}/workouts/`;

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      console.log('Fetching workouts from:', API_ENDPOINT);
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
      console.log('Workouts API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const workoutsData = data.results || data || [];
      console.log('Processed workouts data:', workoutsData);
      
      setWorkouts(workoutsData);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return 'badge bg-success';
      case 'intermediate': return 'badge bg-warning text-dark';
      case 'advanced': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return 'bi bi-star';
      case 'intermediate': return 'bi bi-star-half';
      case 'advanced': return 'bi bi-star-fill';
      default: return 'bi bi-question-circle';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading workouts...</p>
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
            Error Loading Workouts
          </h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={fetchWorkouts}>
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
            <div className="card-header bg-danger text-white">
              <div className="row align-items-center">
                <div className="col">
                  <h2 className="h4 mb-0">
                    <i className="bi bi-lightning-charge me-2"></i>
                    Workout Library
                  </h2>
                </div>
                <div className="col-auto">
                  <button 
                    className="btn btn-light btn-sm" 
                    onClick={fetchWorkouts}
                    title="Refresh Workouts"
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">
                Discover personalized workout suggestions tailored to your fitness level and goals.
              </p>
            </div>
          </div>

          {/* Workout Categories */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">Filter by Category:</h6>
                  <div className="btn-group flex-wrap" role="group">
                    <button className="btn btn-outline-primary active">All</button>
                    <button className="btn btn-outline-primary">Strength</button>
                    <button className="btn btn-outline-primary">Cardio</button>
                    <button className="btn btn-outline-primary">Flexibility</button>
                    <button className="btn btn-outline-primary">HIIT</button>
                    <button className="btn btn-outline-primary">Yoga</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workouts Grid */}
          {workouts.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-lightning display-1 text-muted"></i>
                <h5 className="text-muted mt-3">No Workouts Available</h5>
                <p className="text-muted">Check back later for personalized workout suggestions.</p>
                <button className="btn btn-danger btn-lg">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Custom Workout
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Workout Cards */}
              <div className="row g-4 mb-4">
                {workouts.map((workout, index) => (
                  <div key={workout.id || index} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm workout-card">
                      <div className="card-header">
                        <div className="row align-items-center">
                          <div className="col">
                            <h6 className="mb-0 text-truncate">
                              <i className="bi bi-lightning-charge me-1 text-danger"></i>
                              {workout.name || workout.title || 'Unnamed Workout'}
                            </h6>
                          </div>
                          <div className="col-auto">
                            <span className={getDifficultyBadge(workout.difficulty_level || workout.difficulty)}>
                              <i className={`${getDifficultyIcon(workout.difficulty_level || workout.difficulty)} me-1`}></i>
                              {workout.difficulty_level || workout.difficulty || 'General'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="card-text text-muted small mb-3">
                          {workout.description || 'No description available'}
                        </p>
                        
                        {/* Workout Details */}
                        <div className="row text-center mb-3">
                          <div className="col-4">
                            <div className="border rounded p-2">
                              <div className="h6 mb-0 text-primary">
                                <i className="bi bi-clock"></i>
                              </div>
                              <div className="small fw-semibold">{workout.duration || workout.estimated_duration || 'N/A'}</div>
                              <small className="text-muted">Duration</small>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="border rounded p-2">
                              <div className="h6 mb-0 text-warning">
                                <i className="bi bi-fire"></i>
                              </div>
                              <div className="small fw-semibold">{workout.calories || workout.estimated_calories || 'N/A'}</div>
                              <small className="text-muted">Calories</small>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="border rounded p-2">
                              <div className="h6 mb-0 text-success">
                                <i className="bi bi-list-check"></i>
                              </div>
                              <div className="small fw-semibold">{workout.exercise_count || workout.exercises?.length || 0}</div>
                              <small className="text-muted">Exercises</small>
                            </div>
                          </div>
                        </div>

                        {/* Workout Category */}
                        {workout.category && (
                          <div className="mb-3">
                            <span className="badge bg-info text-dark">
                              <i className="bi bi-tag me-1"></i>
                              {workout.category}
                            </span>
                          </div>
                        )}

                        {/* Equipment Required */}
                        {workout.equipment_required && (
                          <div className="mb-3">
                            <small className="text-muted d-block mb-1">Equipment:</small>
                            <span className="badge bg-light text-dark border">
                              {workout.equipment_required}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="card-footer bg-transparent">
                        <div className="d-grid gap-2">
                          <button className="btn btn-danger">
                            <i className="bi bi-play-fill me-1"></i>
                            Start Workout
                          </button>
                          <div className="btn-group" role="group">
                            <button className="btn btn-outline-secondary btn-sm">
                              <i className="bi bi-eye me-1"></i>
                              View Details
                            </button>
                            <button className="btn btn-outline-primary btn-sm">
                              <i className="bi bi-bookmark me-1"></i>
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Workouts Table */}
              <div className="card shadow-sm">
                <div className="card-header">
                  <h5 className="mb-0">
                    All Workouts 
                    <span className="badge bg-secondary ms-2">{workouts.length}</span>
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">
                            <i className="bi bi-lightning me-1"></i>
                            Workout Name
                          </th>
                          <th scope="col">
                            <i className="bi bi-tag me-1"></i>
                            Category
                          </th>
                          <th scope="col">
                            <i className="bi bi-star me-1"></i>
                            Difficulty
                          </th>
                          <th scope="col">
                            <i className="bi bi-clock me-1"></i>
                            Duration
                          </th>
                          <th scope="col">
                            <i className="bi bi-fire me-1"></i>
                            Calories
                          </th>
                          <th scope="col">
                            <i className="bi bi-list-check me-1"></i>
                            Exercises
                          </th>
                          <th scope="col">
                            <i className="bi bi-tools me-1"></i>
                            Equipment
                          </th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workouts.map((workout, index) => (
                          <tr key={workout.id || index}>
                            <td>
                              <div className="fw-semibold">
                                {workout.name || workout.title || 'Unnamed Workout'}
                              </div>
                              <small className="text-muted">
                                {workout.description ? workout.description.substring(0, 50) + '...' : 'No description'}
                              </small>
                            </td>
                            <td>
                              <span className="badge bg-info text-dark">
                                {workout.category || 'General'}
                              </span>
                            </td>
                            <td>
                              <span className={getDifficultyBadge(workout.difficulty_level || workout.difficulty)}>
                                <i className={`${getDifficultyIcon(workout.difficulty_level || workout.difficulty)} me-1`}></i>
                                {workout.difficulty_level || workout.difficulty || 'N/A'}
                              </span>
                            </td>
                            <td>
                              <i className="bi bi-clock me-1 text-muted"></i>
                              {workout.duration || workout.estimated_duration || 'N/A'}
                            </td>
                            <td>
                              <i className="bi bi-fire me-1 text-warning"></i>
                              {workout.calories || workout.estimated_calories || 'N/A'}
                            </td>
                            <td>
                              <span className="badge bg-success">
                                {workout.exercise_count || workout.exercises?.length || 0}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {workout.equipment_required || 'None'}
                              </small>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <button className="btn btn-danger btn-sm" title="Start Workout">
                                  <i className="bi bi-play-fill"></i>
                                </button>
                                <button className="btn btn-outline-primary btn-sm" title="View Details">
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button className="btn btn-outline-secondary btn-sm" title="Bookmark">
                                  <i className="bi bi-bookmark"></i>
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

          {/* Create Workout Button */}
          <div className="text-center mt-4">
            <button className="btn btn-danger btn-lg me-2">
              <i className="bi bi-plus-circle me-2"></i>
              Create Custom Workout
            </button>
            <button className="btn btn-outline-warning btn-lg">
              <i className="bi bi-shuffle me-2"></i>
              Generate Random Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;