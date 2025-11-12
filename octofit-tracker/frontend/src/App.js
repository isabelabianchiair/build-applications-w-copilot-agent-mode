import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <div className="App">
      {/* Bootstrap Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-activity me-2"></i>
            OctoFit Tracker
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className={isActive('/activities')} to="/activities">
                  <i className="bi bi-calendar-check me-1"></i>
                  Activities
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isActive('/workouts')} to="/workouts">
                  <i className="bi bi-lightning-charge me-1"></i>
                  Workouts
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isActive('/teams')} to="/teams">
                  <i className="bi bi-people me-1"></i>
                  Teams
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isActive('/users')} to="/users">
                  <i className="bi bi-person-circle me-1"></i>
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link className={isActive('/leaderboard')} to="/leaderboard">
                  <i className="bi bi-trophy me-1"></i>
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="bg-light text-center text-muted py-3 mt-5">
        <div className="container">
          <p className="mb-0">
            <i className="bi bi-heart-fill text-danger me-1"></i>
            Built with React & Bootstrap | OctoFit Tracker &copy; 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

// Home Component
function Home() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">
              Welcome to OctoFit Tracker
            </h1>
            <p className="lead text-muted">
              Your comprehensive fitness journey companion. Track activities, join teams, 
              and compete on leaderboards while getting personalized workout suggestions.
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-calendar-check display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Track Activities</h5>
                  <p className="card-text">
                    Log your workouts, runs, and fitness activities with detailed metrics.
                  </p>
                  <Link to="/activities" className="btn btn-primary">
                    View Activities
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-people display-4 text-success mb-3"></i>
                  <h5 className="card-title">Join Teams</h5>
                  <p className="card-text">
                    Connect with others, create teams, and work together towards fitness goals.
                  </p>
                  <Link to="/teams" className="btn btn-success">
                    Explore Teams
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-trophy display-4 text-warning mb-3"></i>
                  <h5 className="card-title">Leaderboard</h5>
                  <p className="card-text">
                    Compete with friends and see how you rank in various fitness challenges.
                  </p>
                  <Link to="/leaderboard" className="btn btn-warning">
                    View Rankings
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-lightning-charge display-4 text-danger mb-3"></i>
                  <h5 className="card-title">Workouts</h5>
                  <p className="card-text">
                    Get personalized workout suggestions tailored to your fitness level.
                  </p>
                  <Link to="/workouts" className="btn btn-danger">
                    Get Workouts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;