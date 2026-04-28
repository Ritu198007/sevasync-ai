import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import AuthScreen from './components/AuthScreen';
import SOSButton from './SOSButton';
import AidFeed from './components/AidFeed';
import AISearchBar from './components/AISearchBar';
import NGOHelp from './components/NGOHelp';
import NGOList from './components/NGOList'; // ✅ NEW IMPORT

import './App.css';

const AdminDashboard = () => (
  <div className="admin-box">
    <h2>Admin Control Center</h2>
    <div className="stats-grid">
      <div className="stat-card"><h3>24</h3><p>Active Volunteers</p></div>
      <div className="stat-card"><h3>5</h3><p>Open SOS Alerts</p></div>
    </div>
    <p className="status-text">
      System Status: <span className="ai-glow">Fully Operational</span>
    </p>
  </div>
);

const VolunteerTasks = () => (
  <div className="volunteer-box">
    <h2>Volunteer Task Board</h2>
    <p>Accessing real-time emergency reports...</p>
    <div className="task-actions">
      <button className="progress-update-btn">View Assigned Tasks</button>
    </div>
  </div>
);

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();

  return (
    <header className="main-nav">
      <div className="nav-brand">
        <h1>SevaSync <span className="ai-glow">AI</span></h1>

        {user.role === 'Admin' && (
          <span className="role-tag admin-badge">Admin</span>
        )}

        <AISearchBar />
      </div>

      <nav className="nav-buttons">
        {user.role === 'Admin' && (
          <button onClick={() => navigate('/admin')}>Admin Panel</button>
        )}

        {user.role === 'Volunteer' && (
          <button onClick={() => navigate('/volunteer')}>Tasks</button>
        )}

        {user.role === 'User' && (
          <button onClick={() => navigate('/user')}>SOS</button>
        )}

        <button onClick={() => navigate('/feed')}>Aid Feed</button>

        <button onClick={() => navigate('/help')}>Help</button>

        <button onClick={logout} className="logout-btn">Logout</button>
      </nav>
    </header>
  );
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('seva_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('seva_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('seva_user');
  };

  if (!user) return <AuthScreen onLogin={login} />;

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar user={user} logout={logout} />

        <main className="dashboard-layout">
          <Routes>

            <Route
              path="/admin"
              element={user.role === 'Admin' ? <AdminDashboard /> : <Navigate to="/" />}
            />

            <Route
              path="/volunteer"
              element={user.role === 'Volunteer' ? <VolunteerTasks /> : <Navigate to="/" />}
            />

            <Route
              path="/user"
              element={user.role === 'User' ? <SOSButton /> : <Navigate to="/" />}
            />

            <Route path="/feed" element={<AidFeed role={user.role} />} />

            {/* NGO CATEGORY PAGE */}
            <Route path="/help" element={<NGOHelp />} />

            {/* NGO DETAILS PAGE */}
            <Route path="/help/:category" element={<NGOList />} />

            <Route
              path="/"
              element={
                user.role === 'Admin' ? <Navigate to="/admin" /> :
                user.role === 'Volunteer' ? <Navigate to="/volunteer" /> :
                <Navigate to="/user" />
              }
            />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;