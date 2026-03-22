import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Subscribe from './pages/Subscribe';
import Profile from './pages/Profile';
import Announcements from './pages/Announcements';
import Layout from './components/Layout';

globalThis.API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  // Use state so logout triggers a re-render and route guards update
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'user');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole('user');
  };

  const defaultAuthRoute = role === 'admin' ? '/admin' : '/dashboard';

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={!token ? <Landing /> : <Navigate to={defaultAuthRoute} />} />
          <Route path="/login" element={!token ? <Login onLogin={(t, r) => { setToken(t); setRole(r); }} /> : <Navigate to={defaultAuthRoute} />} />
          <Route path="/register" element={!token ? <Register onLogin={(t, r) => { setToken(t); setRole(r); }} /> : <Navigate to={defaultAuthRoute} />} />

          {/* Shared Authenticated Routes */}
          <Route path="/announcements" element={token ? <Announcements /> : <Navigate to="/login" />} />

          {/* User Only Routes */}
          <Route path="/dashboard" element={token && role === 'user' ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/subscribe" element={token && role === 'user' ? <Subscribe /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token && role === 'user' ? <Profile /> : <Navigate to="/login" />} />

          {/* Admin Only Routes */}
          <Route path="/admin" element={token && role === 'admin' ? <Admin /> : <Navigate to="/login" />} />

          <Route path="*" element={<Navigate to={token ? defaultAuthRoute : '/login'} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
