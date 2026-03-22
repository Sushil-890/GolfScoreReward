import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // Routes where we want strict public/unauthenticated view
  const isPublicRoute = ['/login', '/register', '/'].includes(location.pathname);

  // If unauthenticated or actively looking at a public route
  if (!token || isPublicRoute) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // Dashboard Shell Configuration
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 w-full min-w-0 transition-all duration-300 ease-in-out">
        
        {/* Dashboard Top Navbar */}
        <header className="bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-gray-600 focus:outline-none">
              <Menu size={24} />
            </button>
            <div className="md:hidden text-xl font-black text-gray-800">
              Digital<span className="text-green-600">Heroes</span>
            </div>
            {/* Desktop spacer since logo is in sidebar */}
            <div className="hidden md:block font-semibold text-gray-500 uppercase tracking-widest text-[10px]">
              Rewards & Participation Hub
            </div>
          </div>

          {/* Right Side - Profile Icon */}
          <div className="flex items-center gap-4">
             <a href="/profile" className="text-gray-500 hover:text-green-600 transition flex items-center gap-2">
                <span className="hidden sm:block text-sm font-semibold truncate max-w-[120px]">My Account</span>
                <div className="bg-green-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                    <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
                  </svg>
                </div>
             </a>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
