import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, UserCircle, LogOut, ShieldAlert, Megaphone } from 'lucide-react';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'user';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const navItemClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold
    ${location.pathname === path 
      ? 'bg-green-600 text-white shadow-md' 
      : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
    }
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 shadow-sm z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tight text-gray-800">
            Digital<span className="text-green-600">Heroes</span>
          </Link>
          <button className="md:hidden text-gray-500" onClick={() => setMobileOpen(false)}>
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">Core Platform</div>
          
          {role === 'admin' ? (
            <>
              <Link to="/admin" onClick={() => setMobileOpen(false)} className={navItemClass('/admin')}>
                <ShieldAlert size={20} />
                Admin Console
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={navItemClass('/dashboard')}>
                <LayoutDashboard size={20} />
                User Dashboard
              </Link>
              <Link to="/subscribe" onClick={() => setMobileOpen(false)} className={navItemClass('/subscribe')}>
                <CreditCard size={20} />
                Billing & Subscription
              </Link>
            </>
          )}

          <div className="pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Updates</div>
          <Link to="/announcements" onClick={() => setMobileOpen(false)} className={navItemClass('/announcements')}>
            <Megaphone size={20} />
            Announcements
          </Link>
        </nav>

        {/* Bottom Logout */}
        <div className="p-4 border-t border-gray-100 mb-4">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 font-semibold hover:bg-red-50 rounded-xl transition"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
