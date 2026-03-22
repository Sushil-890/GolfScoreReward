import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || 'user';

  const [logoutMsg, setLogoutMsg] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsOpen(false);
    setLogoutMsg('Signed out successfully');
    setTimeout(() => navigate('/'), 1500);
  };

  const navLinks = () => {
    if (!token) {
      return (
        <>
          <Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-green-200 transition font-semibold">Login</Link>
          <Link to="/register" onClick={() => setIsOpen(false)} className="bg-white text-green-700 px-5 py-2 rounded-full font-bold shadow hover:bg-gray-100 transition transform hover:-translate-y-0.5">
            Join Now
          </Link>
        </>
      );
    }

    if (role === 'admin') {
      return (
        <>
          <Link to="/admin" onClick={() => setIsOpen(false)} className={`hover:text-green-200 transition font-semibold ${location.pathname === '/admin' ? 'border-b-2 border-white' : ''}`}>Dashboard</Link>
          <button onClick={handleLogout} className="text-red-300 font-bold hover:text-white transition">Logout</button>
        </>
      );
    }

    // Normal User
    return (
      <>
        <Link to="/dashboard" onClick={() => setIsOpen(false)} className={`hover:text-green-200 transition font-semibold ${location.pathname === '/dashboard' ? 'border-b-2 border-white' : ''}`}>Dashboard</Link>
        <Link to="/subscribe" onClick={() => setIsOpen(false)} className={`hover:text-green-200 transition font-semibold ${location.pathname === '/subscribe' ? 'border-b-2 border-white' : ''}`}>Subscription</Link>
        <Link to="/profile" onClick={() => setIsOpen(false)} className={`hover:text-green-200 transition font-semibold ${location.pathname === '/profile' ? 'border-b-2 border-white' : ''}`}>Profile</Link>
        <button onClick={handleLogout} className="bg-red-500 text-white px-5 py-2 rounded-full font-bold shadow hover:bg-red-600 transition transform hover:-translate-y-0.5">Logout</button>
      </>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-lg sticky top-0 z-50">
      {logoutMsg && (
        <div className="bg-green-500 text-white text-center text-sm py-2 font-semibold">
          {logoutMsg}
        </div>
      )}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2">
          Digital<span className="text-green-300">Heroes</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks()}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Expansion */}
      {isOpen && (
        <div className="md:hidden bg-green-900 px-6 py-6 flex flex-col space-y-6 shadow-inner border-t border-green-700">
          {navLinks()}
        </div>
      )}
    </nav>
  );
}
