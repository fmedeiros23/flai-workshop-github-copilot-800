import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Users from './components/Users';
import Activities from './components/Activities';
import Teams from './components/Teams';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';
import logo from './octofitapp-small.png';
import './App.css';

const navItems = [
  { to: '/users',       label: 'Users',       icon: '👤' },
  { to: '/activities',  label: 'Activities',  icon: '🏃' },
  { to: '/teams',       label: 'Teams',       icon: '👥' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { to: '/workouts',    label: 'Workouts',    icon: '💪' },
];

function Home() {
  return (
    <div>
      <div className="hero-section text-center">
        <h1>OctoFit Tracker</h1>
        <p className="lead">Track your fitness activities, compete with teams, and stay motivated!</p>
      </div>
      <div className="row g-4">
        {navItems.map((item) => (
          <div className="col-sm-6 col-lg-4" key={item.to}>
            <NavLink to={item.to} className="text-decoration-none">
              <div className="card octofit-card h-100 text-center p-3">
                <div className="card-body">
                  <div style={{ fontSize: '2.5rem' }}>{item.icon}</div>
                  <h5 className="card-title mt-2 fw-bold" style={{ color: '#1a1a2e' }}>{item.label}</h5>
                  <p className="card-text text-muted small">View {item.label.toLowerCase()} data</p>
                  <span className="btn btn-sm btn-octofit">
                    Open →
                  </span>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg octofit-navbar">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img src={logo} alt="OctoFit logo" />
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-1">
              {navItems.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink className="nav-link" to={item.to}>
                    {item.icon} {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4 pb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
      <footer className="octofit-footer">
        &copy; {new Date().getFullYear()} OctoFit Tracker &mdash; Stay fit, stay motivated!
      </footer>
    </div>
  );
}

export default App;
